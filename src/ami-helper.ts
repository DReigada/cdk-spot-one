
import * as ec2 from '@aws-cdk/aws-ec2';
export enum AmiOSType {
  /**
   * Ubuntu 16.04 AMD64 ami.
   */
  UBUNTU_16_04_AMD64 = 'UBUNTU_16_04_AMD64',

  /**
   * Ubuntu 16.04 ARM64 ami.
   */
  UBUNTU_16_04_ARM64 = 'UBUNTU_16_04_ARM64',

  /**
   * Ubuntu 18.04 AMD64 ami.
   */
  UBUNTU_18_04_AMD64 = 'UBUNTU_18_04_AMD64',

  /**
   * Ubuntu 18.04 ARM64 ami.
   */
  UBUNTU_18_04_ARM64 = 'UBUNTU_18_04_ARM64',

  /**
   * Ubuntu 20.04 AMD64 ami.
   */
  UBUNTU_20_04_AMD64 = 'UBUNTU_20_04_AMD64',

  /**
   * Ubuntu 20.04 ARM64 ami.
   */
  UBUNTU_20_04_ARM64 = 'UBUNTU_20_04_ARM64',

  /**
   * Ubuntu 20.10 AMD64 ami.
   */
  UBUNTU_20_10_AMD64 = 'UBUNTU_20_10_AMD64',

  /**
   * Ubuntu 20.10 ARM64 ami.
   */
  UBUNTU_20_10_ARM64 = 'UBUNTU_20_10_ARM64',

  /**
   * CentOS 7 ami.
   */
  CENTOS_7 = 'CENTOS_7',

  /**
   * CentOS 8 ami.
   */
  CENTOS_8 = 'CENTOS_8',

  /**
   * Amazon Linux 2 ami.
   */
  AMAZON_LINUX_2 = 'AMAZON_LINUX_2',

  /**
   * Amazon Linux  ami.
   */
  AMAZON_LINUX = 'AMAZON_LINUX',

}
export function amiFinder(amiostype: AmiOSType ): ec2.IMachineImage {
  switch (amiostype) {
    case AmiOSType.CENTOS_7:
      return ec2.MachineImage.lookup({
        filters: {
          ['product-code']: ['aw0evgkw8e5c1q413zgy5pjce'],
        },
        name: '*CentOS*',
        owners: ['aws-marketplace'],
      });
    case AmiOSType.CENTOS_8:
      return ec2.MachineImage.lookup({
        filters: {
          ['product-code']: ['aw0evgkw8e5c1q413zgy5pjce'],
        },
        name: '*CentOS*',
        owners: ['aws-marketplace'],
      });
    case AmiOSType.UBUNTU_16_04_AMD64:
      return ec2.MachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/16.04/stable/current/amd64/hvm/ebs-gp2/ami-id');
    case AmiOSType.UBUNTU_16_04_ARM64:
      return ec2.MachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/16.04/stable/current/arm64/hvm/ebs-gp2/ami-id');
    case AmiOSType.UBUNTU_18_04_AMD64:
      return ec2.MachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/18.04/stable/current/amd64/hvm/ebs-gp2/ami-id');
    case AmiOSType.UBUNTU_18_04_ARM64:
      return ec2.MachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/18.04/stable/current/arm64/hvm/ebs-gp2/ami-id');
    case AmiOSType.UBUNTU_20_04_AMD64:
      return ec2.MachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/20.04/stable/current/amd64/hvm/ebs-gp2/ami-id');
    case AmiOSType.UBUNTU_20_04_ARM64:
      return ec2.MachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/20.04/stable/current/arm64/hvm/ebs-gp2/ami-id');
    case AmiOSType.UBUNTU_20_10_AMD64:
      return ec2.MachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/20.10/stable/current/amd64/hvm/ebs-gp2/ami-id');
    case AmiOSType.UBUNTU_20_10_ARM64:
      return ec2.MachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/20.10/stable/current/arm64/hvm/ebs-gp2/ami-id');
    case AmiOSType.AMAZON_LINUX:
      return ec2.MachineImage.latestAmazonLinux();
    case AmiOSType.AMAZON_LINUX_2:
      return ec2.MachineImage.latestAmazonLinux( { generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 });
  }
}

