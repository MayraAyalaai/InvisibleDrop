// 代币合约服务
import { ethers } from 'ethers';
import { getContractRead, getContractWrite, formatError, waitForTransaction } from '../utils/contracts';
import { CONTRACT_ADDRESSES } from '../contracts/contracts';

// 代币服务类
export class TokenService {

  // 铸造 TestToken
  static async mintTestToken(to: string, amount: string) {
    try {
      const contract = await getContractWrite('TestToken');

      const tx = await contract.mint(to, ethers.parseEther(amount));
      console.log('铸造 TestToken 交易已提交:', tx.hash);

      await waitForTransaction(tx.hash);

      return {
        success: true,
        txHash: tx.hash,
        message: `成功铸造 ${amount} TestToken`
      };
    } catch (error) {
      return {
        success: false,
        error: formatError(error)
      };
    }
  }

  // 铸造 TestNFT
  static async mintTestNFT(to: string, uri: string) {
    try {
      const contract = await getContractWrite('TestNFT');

      const tx = await contract.mint(to, uri);
      console.log('铸造 TestNFT 交易已提交:', tx.hash);

      const receipt = await waitForTransaction(tx.hash);

      // 从事件中获取 Token ID
      const transferEvent = receipt.logs?.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'Transfer';
        } catch {
          return false;
        }
      });

      let tokenId = '0';
      if (transferEvent) {
        const parsed = contract.interface.parseLog(transferEvent);
        tokenId = parsed?.args[2]?.toString() || '0';
      }

      return {
        success: true,
        txHash: tx.hash,
        tokenId,
        message: `成功铸造 TestNFT #${tokenId}`
      };
    } catch (error) {
      return {
        success: false,
        error: formatError(error)
      };
    }
  }

  // 铸造 ConfidentialCoin1
  static async mintConfidentialCoin1(to: string, amount: number) {
    try {
      const contract = await getContractWrite('ConfidentialCoin1');

      const tx = await contract.mint(to, amount);
      console.log('铸造 ConfidentialCoin1 交易已提交:', tx.hash);

      await waitForTransaction(tx.hash);

      return {
        success: true,
        txHash: tx.hash,
        message: `成功铸造 ${amount} ConfidentialCoin1`
      };
    } catch (error) {
      return {
        success: false,
        error: formatError(error)
      };
    }
  }

  // 铸造 ConfidentialCoin2
  static async mintConfidentialCoin2(to: string, amount: number) {
    try {
      const contract = await getContractWrite('ConfidentialCoin2');

      const tx = await contract.mint(to, amount);
      console.log('铸造 ConfidentialCoin2 交易已提交:', tx.hash);

      await waitForTransaction(tx.hash);

      return {
        success: true,
        txHash: tx.hash,
        message: `成功铸造 ${amount} ConfidentialCoin2`
      };
    } catch (error) {
      return {
        success: false,
        error: formatError(error)
      };
    }
  }

  // 获取 TestToken 余额
  static async getTestTokenBalance(address: string): Promise<string> {
    try {
      const contract = getContractRead('TestToken');
      const balance = await contract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('获取 TestToken 余额失败:', error);
      return '0';
    }
  }

  // 获取 TestNFT 余额
  static async getTestNFTBalance(address: string): Promise<number> {
    try {
      const contract = getContractRead('TestNFT');
      const balance = await contract.balanceOf(address);
      return Number(balance);
    } catch (error) {
      console.error('获取 TestNFT 余额失败:', error);
      return 0;
    }
  }

  // 获取用户拥有的 TestNFT 列表
  static async getUserTestNFTs(address: string): Promise<Array<{tokenId: string, uri: string}>> {
    try {
      const contract = getContractRead('TestNFT');
      const balance = await contract.balanceOf(address);
      const nfts = [];

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const uri = await contract.tokenURI(tokenId);
        nfts.push({
          tokenId: tokenId.toString(),
          uri
        });
      }

      return nfts;
    } catch (error) {
      console.error('获取用户 TestNFT 列表失败:', error);
      return [];
    }
  }

  // 获取 TestToken 信息
  static async getTestTokenInfo() {
    try {
      const contract = getContractRead('TestToken');
      const [name, symbol, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.totalSupply()
      ]);

      return {
        name,
        symbol,
        totalSupply: ethers.formatEther(totalSupply)
      };
    } catch (error) {
      console.error('获取 TestToken 信息失败:', error);
      return null;
    }
  }

  // 获取 TestNFT 信息
  static async getTestNFTInfo() {
    try {
      const contract = getContractRead('TestNFT');
      const [name, symbol] = await Promise.all([
        contract.name(),
        contract.symbol()
      ]);

      return {
        name,
        symbol
      };
    } catch (error) {
      console.error('获取 TestNFT 信息失败:', error);
      return null;
    }
  }

  // 获取 ConfidentialCoin 信息
  static async getConfidentialCoinInfo(coinNumber: 1 | 2) {
    try {
      const contractName = coinNumber === 1 ? 'ConfidentialCoin1' : 'ConfidentialCoin2';
      const contract = getContractRead(contractName);

      const [name, symbol] = await Promise.all([
        contract.name(),
        contract.symbol()
      ]);

      return {
        name,
        symbol
      };
    } catch (error) {
      console.error(`获取 ConfidentialCoin${coinNumber} 信息失败:`, error);
      return null;
    }
  }

  // 给空投合约充值 - 直接mint到空投合约地址
  static async depositToAirdrop(tokenType: 'ConfidentialCoin1' | 'ConfidentialCoin2', amount: string) {
    const airdropAddress = CONTRACT_ADDRESSES.InvisibleDrop;

    switch (tokenType) {
      case 'ConfidentialCoin1':
        try {
          const contract = await getContractWrite('ConfidentialCoin1');
          const amountInWei = parseInt(amount)*1000000;

          const tx = await contract.mint(airdropAddress, amountInWei);
          console.log('向空投合约充值 ConfidentialCoin1 交易已提交:', tx.hash);

          await waitForTransaction(tx.hash);

          return {
            success: true,
            txHash: tx.hash,
            message: `成功向空投合约充值 ${amount} ConfidentialCoin1`
          };
        } catch (error) {
          return {
            success: false,
            error: formatError(error)
          };
        }

      case 'ConfidentialCoin2':
        try {
          const contract = await getContractWrite('ConfidentialCoin2');
          const amountInWei = parseInt(amount)*1000000;

          const tx = await contract.mint(airdropAddress, amountInWei);
          console.log('向空投合约充值 ConfidentialCoin2 交易已提交:', tx.hash);

          await waitForTransaction(tx.hash);

          return {
            success: true,
            txHash: tx.hash,
            message: `成功向空投合约充值 ${amount} ConfidentialCoin2`
          };
        } catch (error) {
          return {
            success: false,
            error: formatError(error)
          };
        }

      default:
        return {
          success: false,
          error: '不支持的代币类型'
        };
    }
  }
}