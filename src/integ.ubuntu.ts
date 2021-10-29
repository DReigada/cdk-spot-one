import { InstanceType } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { AmiOSType, amiFinder } from './ami-helper';
import { VpcProvider, SpotInstance } from './spot';

export class IntegTesting {
  readonly stack: cdk.Stack[];

  constructor() {

    const app = new cdk.App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stackName = app.node.tryGetContext('stackName') || 'SpotOneStack';
    const stack = new cdk.Stack(app, stackName, { env });

    const keyName = stack.node.tryGetContext('ssh_key_name');
    const vpc = VpcProvider.getOrCreate(stack);

    const spot = new SpotInstance(stack, 'SpotInstanceUbuntu', {
      vpc,
      customAmiId: amiFinder(AmiOSType.UBUNTU_20_04_ARM64).getImage(stack).imageId,
      defaultInstanceType: new InstanceType('t4g.medium'),
      keyName,
      blockDeviceMappings: [{ deviceName: '/dev/sda1', ebs: { volumeSize: 20 } }],
      additionalUserData: ['curl -fsSL https://get.docker.com -o get-docker.sh', 'sudo sh get-docker.sh'],
    });
    new cdk.CfnOutput(stack, 'InstnaceId', { value: spot.instanceId! });

    this.stack = [stack];
  }
}

// run the integ testing
new IntegTesting();


