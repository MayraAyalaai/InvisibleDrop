// ethers 合约交互工具
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, SEPOLIA_CHAIN_ID, SEPOLIA_RPC_URL } from '../contracts/contracts';

// 获取提供者
export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    // 使用用户的钱包提供者
    return new ethers.BrowserProvider(window.ethereum);
  } else {
    // 使用只读提供者
    return new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  }
}

// 获取签名者
export async function getSigner() {
  const provider = getProvider();
  if ('getSigner' in provider) {
    return await provider.getSigner();
  }
  throw new Error('无法获取签名者，请连接钱包');
}

// 获取合约实例（只读）
export function getContractRead(contractName: keyof typeof CONTRACT_ADDRESSES) {
  const provider = getProvider();
  const address = CONTRACT_ADDRESSES[contractName];
  const abi = CONTRACT_ABIS[contractName];

  return new ethers.Contract(address, abi, provider);
}

// 获取合约实例（可写）
export async function getContractWrite(contractName: keyof typeof CONTRACT_ADDRESSES) {
  const signer = await getSigner();
  const address = CONTRACT_ADDRESSES[contractName];
  const abi = CONTRACT_ABIS[contractName];

  return new ethers.Contract(address, abi, signer);
}

// 检查网络
export async function checkNetwork() {
  const provider = getProvider();
  const network = await provider.getNetwork();

  if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
    throw new Error(`请切换到 Sepolia 测试网络。当前网络: ${network.chainId}`);
  }

  return network;
}

// 格式化错误信息
export function formatError(error: any): string {
  if (error?.reason) {
    return error.reason;
  }
  if (error?.message) {
    return error.message;
  }
  return '交易失败';
}

// 等待交易确认
export async function waitForTransaction(txHash: string, confirmations = 1) {
  const provider = getProvider();
  const receipt = await provider.waitForTransaction(txHash, confirmations);

  if (!receipt) {
    throw new Error('交易确认失败');
  }

  if (receipt.status === 0) {
    throw new Error('交易执行失败');
  }

  return receipt;
}