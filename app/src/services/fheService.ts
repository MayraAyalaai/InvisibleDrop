// FHE 解密服务
import { getContractRead } from '../utils/contracts';
import { CONTRACT_ADDRESSES } from '../contracts/contracts';

export class FHEService {
  // 解密 ConfidentialCoin 余额
  static async decryptBalance(
    tokenType: 'ConfidentialCoin1' | 'ConfidentialCoin2',
    userAddress: string,
    instance: any,
    signer: any
  ): Promise<string> {
    try {
      const contract = getContractRead(tokenType);
      const contractAddress = CONTRACT_ADDRESSES[tokenType];

      // 获取加密余额句柄
      const encryptedBalance = await contract.confidentialBalanceOf(userAddress);
      console.log('加密余额句柄:', encryptedBalance);

      if (!encryptedBalance || encryptedBalance === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        return '0';
      }

      // 生成密钥对
      const keypair = instance.generateKeypair();

      // 准备解密请求
      const handleContractPairs = [{
        handle: encryptedBalance.toString(),
        contractAddress: contractAddress,
      }];

      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = "1"; // 1天有效期

      // 创建 EIP712 签名
      const eip712 = instance.createEIP712(
        keypair.publicKey,
        [contractAddress],
        startTimeStamp,
        durationDays
      );

      // 签名
      const signature = await signer.signTypedData(
        eip712.domain,
        {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
        },
        eip712.message,
      );

      // 执行用户解密
      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace("0x", ""),
        [contractAddress],
        userAddress,
        startTimeStamp,
        durationDays,
      );

      const decryptedValue = result[encryptedBalance.toString()];
      console.log('解密结果:', decryptedValue);

      return decryptedValue ? decryptedValue.toString() : '0';

    } catch (error: any) {
      console.error(`解密 ${tokenType} 余额失败:`, error);
      throw new Error('解密失败: ' + error.message);
    }
  }

  // 检查用户是否有权限解密
  static async canDecrypt(): Promise<boolean> {
    try {
      // 检查用户是否有访问权限
      // 这里需要调用合约的 ACL 检查方法
      // 目前返回 true，表示所有用户都可以解密自己的余额
      return true;

    } catch (error) {
      console.error(`检查解密权限失败:`, error);
      return false;
    }
  }

  // 获取加密余额句柄 (不解密)
  static async getEncryptedBalance(tokenType: 'ConfidentialCoin1' | 'ConfidentialCoin2', userAddress: string): Promise<string> {
    try {
      const contract = getContractRead(tokenType);
      const encryptedBalance = await contract.confidentialBalanceOf(userAddress);
      return encryptedBalance.toString();
    } catch (error) {
      console.error(`获取加密余额失败:`, error);
      return '0x0';
    }
  }
}