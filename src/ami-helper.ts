import * as ec2 from '@aws-cdk/aws-ec2';

export class AmazonMachineImage {
  public static readonly AMAZON_LINUX = ec2.MachineImage.latestAmazonLinux();
  public static readonly AMAZON_LINUX_2 = ec2.MachineImage.latestAmazonLinux( { generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 });
  /**
   * CentOS product code from https://wiki.centos.org/Cloud/AWS
   */
  public static readonly CENTOS_7 = ec2.MachineImage.lookup({
    filters: {
      ['product-code']: ['cvugziknvmxgqna9noibqnnsy'],
    },
    name: '*CentOS*',
    owners: ['aws-marketplace'],
  });
  public static readonly CENTOS_8 = ec2.MachineImage.lookup({
    filters: {
      ['product-code']: ['47k9ia2igxpcce2bzo8u3kj03'],
    },
    name: '*CentOS*',
    owners: ['aws-marketplace'],
  });
  public static readonly UBUNTU_16_04_AMD64 = AmazonMachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/16.04/stable/current/amd64/hvm/ebs-gp2/ami-id');
  public static readonly UBUNTU_16_04_ARM64 = AmazonMachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/16.04/stable/current/arm64/hvm/ebs-gp2/ami-id');
  public static readonly UBUNTU_18_04_AMD64 = AmazonMachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/18.04/stable/current/amd64/hvm/ebs-gp2/ami-id');
  public static readonly UBUNTU_18_04_ARM64 = AmazonMachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/18.04/stable/current/arm64/hvm/ebs-gp2/ami-id');
  public static readonly UBUNTU_20_04_AMD64 = AmazonMachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/20.04/stable/current/amd64/hvm/ebs-gp2/ami-id');
  public static readonly UBUNTU_20_04_ARM64 = AmazonMachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/20.04/stable/current/arm64/hvm/ebs-gp2/ami-id');
  public static readonly UBUNTU_20_10_AMD64 = AmazonMachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/20.10/stable/current/amd64/hvm/ebs-gp2/ami-id');
  public static readonly UBUNTU_20_10_ARM64 = AmazonMachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/20.10/stable/current/arm64/hvm/ebs-gp2/ami-id');
  public static fromSsmParameter(path: string): ec2.IMachineImage {
    return ec2.MachineImage.fromSsmParameter(path);
  }
  constructor() {}
}