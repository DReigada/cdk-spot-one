import {
  App, Stack, Duration,
  aws_ec2 as ec2,
  aws_iam as iam,
} from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SpotFleet, InstanceInterruptionBehavior } from '../src';
import { BlockDuration } from '../src/spot';

describe('SpotFleet', () => {
  let mockApp: App;
  let stack: Stack;

  beforeEach(() => {
    mockApp = new App();
    stack = new Stack(mockApp, 'testing-stack');
  });

  test('default cluster provision single ec2 instance', () => {
    new SpotFleet(stack, 'SpotFleet');
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SpotFleet', {
      SpotFleetRequestConfigData: {
        TargetCapacity: 1,
      },
    });
  });

  test('fleet with custom AMI ID comes with default linux userdata', () => {
    new SpotFleet(stack, 'SpotFleet', {
      customAmiId: 'ami-xxxxxx',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
      LaunchTemplateData: {
        UserData: {
          'Fn::Base64': '#!/bin/bash',
        },
      },
    });
  });


  test('create the SpotFleet', () => {
    const fleet = new SpotFleet(stack, 'SpotFleet', {
      targetCapacity: 1,
      blockDuration: BlockDuration.SIX_HOURS,
      instanceInterruptionBehavior: InstanceInterruptionBehavior.HIBERNATE,
      defaultInstanceType: new ec2.InstanceType('t3.large'),
      eipAllocationId: 'eipalloc-0d1bc6d85895a5410',
      vpcSubnet: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      terminateInstancesWithExpiration: true,
    });
    // fleet to expire after 6 hours
    fleet.expireAfter(Duration.hours(6));
    fleet.defaultSecurityGroup.connections.allowFromAnyIpv4(ec2.Port.tcp(80));
    Template.fromStack(stack).resourceCountIs('AWS::EC2::SpotFleet', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
      LaunchTemplateData: {
        InstanceMarketOptions: {
          MarketType: 'spot',
          SpotOptions: {
            BlockDurationMinutes: 360,
            InstanceInterruptionBehavior: 'hibernate',
          },
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'from 0.0.0.0/0:22',
          FromPort: 22,
          IpProtocol: 'tcp',
          ToPort: 22,
        },
        {
          CidrIp: '0.0.0.0/0',
          Description: 'from 0.0.0.0/0:80',
          FromPort: 80,
          IpProtocol: 'tcp',
          ToPort: 80,
        },
      ],
    });
  });

  test('feet with custom security group that only allow http', () => {
    const securityGroup = new ec2.SecurityGroup(stack, 'Custom Security Group', {
      vpc: new ec2.Vpc(stack, 'VPC'),
    });
    securityGroup.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

    new SpotFleet(stack, 'SpotFleet', {
      securityGroup,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'from 0.0.0.0/0:80',
          FromPort: 80,
          IpProtocol: 'tcp',
          ToPort: 80,
        },
      ],
    });
  });

  test('fleet with custom instance role', () => {
    const anotherStack = new Stack(mockApp, 'another-stack');

    new SpotFleet(anotherStack, 'SpotFleet', {
      instanceRole: new iam.Role(anotherStack, 'Custom Role', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        roleName: 'CustomRole',
      }),
    });

    Template.fromStack(anotherStack).hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'CustomRole',
    });
  });

  test('feet without custom instance role comes with default role', () => {
    new SpotFleet(stack, 'SpotFleet', {});

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        'arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore',
      ],
    });
  });

  test('support additional user data', () => {
    new SpotFleet(stack, 'SpotFleet', {
      targetCapacity: 1,
      blockDuration: BlockDuration.SIX_HOURS,
      instanceInterruptionBehavior: InstanceInterruptionBehavior.HIBERNATE,
      defaultInstanceType: new ec2.InstanceType('t3.large'),
      vpcSubnet: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      terminateInstancesWithExpiration: true,
      additionalUserData: [
        'mycommand1',
        'mycommand2 arg1',
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
      LaunchTemplateData: {
        UserData: {
          'Fn::Base64': '#!/bin/bash\nyum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm\nyum install -y docker\nusermod -aG docker ec2-user\nusermod -aG docker ssm-user\nservice docker start\nmycommand1\nmycommand2 arg1',
        },
      },
    });
  });

  test('long time spot fleet', () => {
    new SpotFleet(stack, 'SpotFleet', {
      targetCapacity: 1,
      blockDuration: BlockDuration.NONE,
      defaultInstanceType: new ec2.InstanceType('t3.large'),
      vpcSubnet: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      terminateInstancesWithExpiration: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
      LaunchTemplateData: {
        InstanceMarketOptions: {
          MarketType: 'spot',
          SpotOptions: {
            InstanceInterruptionBehavior: 'terminate',
          },
        },
      },
    });
  });
});
