// InvisibleDrop 合约服务
import { ethers } from 'ethers';
import { getContractRead, getContractWrite, formatError, waitForTransaction } from '../utils/contracts';

// 空投配置接口
export interface AirdropConfig {
  rewardToken: string;
  rewardPerUser: number;
  endTime: number;
  requireNFT: boolean;
  nftContract: string;
  requireToken: boolean;
  tokenContract: string;
  minTokenAmount: string;
}

// 空投信息接口
export interface AirdropInfo {
  airdropper: string;
  rewardToken: string;
  rewardPerUser: number;
  isActive: boolean;
  endTime: number;
}

// 空投条件接口
export interface AirdropConditions {
  requireNFT: boolean;
  nftContract: string;
  requireToken: boolean;
  tokenContract: string;
  minTokenAmount: string;
}

// 用户领取信息接口
export interface UserClaimInfo {
  hasClaimed: boolean;
  claimTime: number;
}

// InvisibleDrop 服务类
export class InvisibleDropService {

  // 创建空投
  static async createAirdrop(config: AirdropConfig) {
    try {
      const contract = await getContractWrite('InvisibleDrop');

      const tx = await contract.createAirdrop(
        config.rewardToken,
        config.rewardPerUser,
        config.endTime,
        config.requireNFT,
        config.nftContract,
        config.requireToken,
        config.tokenContract,
        ethers.parseEther(config.minTokenAmount)
      );

      console.log('创建空投交易已提交:', tx.hash);
      const receipt = await waitForTransaction(tx.hash);

      // 从事件中获取空投ID
      const airdropCreatedEvent = receipt.logs?.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'AirdropCreated';
        } catch {
          return false;
        }
      });

      let airdropId = '0';
      if (airdropCreatedEvent) {
        const parsed = contract.interface.parseLog(airdropCreatedEvent);
        airdropId = parsed?.args[0]?.toString() || '0';
      }

      return {
        success: true,
        txHash: tx.hash,
        airdropId,
        message: `空投创建成功！空投ID: ${airdropId}`
      };
    } catch (error) {
      return {
        success: false,
        error: formatError(error)
      };
    }
  }

  // 检查用户资格
  static async checkEligibility(airdropId: number, userAddress: string): Promise<boolean> {
    try {
      const contract = getContractRead('InvisibleDrop');
      return await contract.checkEligibility(airdropId, userAddress);
    } catch (error) {
      console.error('检查资格失败:', error);
      return false;
    }
  }

  // 检查可领取数量
  static async checkClaimableAmount(airdropId: number, userAddress: string): Promise<number> {
    try {
      const contract = getContractRead('InvisibleDrop');
      const amount = await contract.checkClaimableAmount(airdropId, userAddress);
      return Number(amount);
    } catch (error) {
      console.error('检查可领取数量失败:', error);
      return 0;
    }
  }

  // 领取奖励
  static async claimReward(airdropId: number) {
    try {
      const contract = await getContractWrite('InvisibleDrop');

      const tx = await contract.claimReward(airdropId);
      console.log('领取奖励交易已提交:', tx.hash);

      await waitForTransaction(tx.hash);

      return {
        success: true,
        txHash: tx.hash,
        message: '奖励领取成功！'
      };
    } catch (error) {
      return {
        success: false,
        error: formatError(error)
      };
    }
  }

  // 获取空投信息
  static async getAirdropInfo(airdropId: number): Promise<AirdropInfo | null> {
    try {
      const contract = getContractRead('InvisibleDrop');
      const info = await contract.getAirdropInfo(airdropId);

      return {
        airdropper: info[0],
        rewardToken: info[1],
        rewardPerUser: Number(info[2]),
        isActive: info[3],
        endTime: Number(info[4])
      };
    } catch (error) {
      console.error('获取空投信息失败:', error);
      return null;
    }
  }

  // 获取空投条件
  static async getAirdropConditions(airdropId: number): Promise<AirdropConditions | null> {
    try {
      const contract = getContractRead('InvisibleDrop');
      const conditions = await contract.getAirdropConditions(airdropId);

      return {
        requireNFT: conditions[0],
        nftContract: conditions[1],
        requireToken: conditions[2],
        tokenContract: conditions[3],
        minTokenAmount: ethers.formatEther(conditions[4])
      };
    } catch (error) {
      console.error('获取空投条件失败:', error);
      return null;
    }
  }

  // 获取用户领取信息
  static async getUserClaimInfo(airdropId: number, userAddress: string): Promise<UserClaimInfo | null> {
    try {
      const contract = getContractRead('InvisibleDrop');
      const claimInfo = await contract.getUserClaimInfo(airdropId, userAddress);

      return {
        hasClaimed: claimInfo[0],
        claimTime: Number(claimInfo[1])
      };
    } catch (error) {
      console.error('获取用户领取信息失败:', error);
      return null;
    }
  }

  // 获取空投总数
  static async getAirdropCount(): Promise<number> {
    try {
      const contract = getContractRead('InvisibleDrop');
      const count = await contract.airdropCount();
      return Number(count);
    } catch (error) {
      console.error('获取空投总数失败:', error);
      return 0;
    }
  }

  // 充值奖励代币 (需要 FHE 加密输入)
  static async depositRewards(airdropId: number, amount: string, inputProof: string) {
    try {
      const contract = await getContractWrite('InvisibleDrop');

      // 这里需要使用 @zama-fhe/relayer-sdk 来创建加密输入
      // 暂时使用明文金额，实际使用时需要加密
      const tx = await contract.depositRewards(airdropId, amount, inputProof);
      console.log('充值奖励交易已提交:', tx.hash);

      await waitForTransaction(tx.hash);

      return {
        success: true,
        txHash: tx.hash,
        message: '奖励充值成功！'
      };
    } catch (error) {
      return {
        success: false,
        error: formatError(error)
      };
    }
  }
}