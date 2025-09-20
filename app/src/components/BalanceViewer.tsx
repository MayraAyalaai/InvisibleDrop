import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { TokenService } from '../services/tokens';
import { FHEService } from '../services/fheService';
import { CONTRACT_ADDRESSES } from '../contracts/contracts';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';

interface UserBalances {
  testToken: string;
  testNFT: number;
  testNFTs: Array<{tokenId: string, uri: string}>;
}

interface ConfidentialBalance {
  coin1: string | null;
  coin2: string | null;
}

export function BalanceViewer() {
  const { address } = useAccount();
  const { instance: zamaInstance, isLoading: zamaLoading, error: zamaError } = useZamaInstance();
  const signer = useEthersSigner();
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<UserBalances | null>(null);
  const [confidentialBalances, setConfidentialBalances] = useState<ConfidentialBalance>({ coin1: null, coin2: null });
  const [decryptingCoin1, setDecryptingCoin1] = useState(false);
  const [decryptingCoin2, setDecryptingCoin2] = useState(false);

  // 加载公开代币余额
  const loadPublicBalances = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const [testTokenBalance, testNFTBalance, testNFTs] = await Promise.all([
        TokenService.getTestTokenBalance(address),
        TokenService.getTestNFTBalance(address),
        TokenService.getUserTestNFTs(address)
      ]);

      setBalances({
        testToken: testTokenBalance,
        testNFT: testNFTBalance,
        testNFTs
      });
    } catch (error) {
      console.error('加载余额失败:', error);
    }
    setLoading(false);
  };

  // 解密 ConfidentialCoin1 余额
  const decryptCoin1Balance = async () => {
    if (!address || !zamaInstance || !signer) {
      alert('请等待初始化完成并连接钱包');
      return;
    }

    setDecryptingCoin1(true);
    try {
      // 调用 FHE 解密服务
      const balance = await FHEService.decryptBalance('ConfidentialCoin1', address, zamaInstance,await signer);
      setConfidentialBalances(prev => ({ ...prev, coin1: balance }));

      // alert(`ConfidentialCoin1 余额解密成功: ${balance}`);
    } catch (error) {
      console.error('解密 ConfidentialCoin1 余额失败:', error);
      alert('解密失败，请重试: ' + error.message);
    }
    setDecryptingCoin1(false);
  };

  // 解密 ConfidentialCoin2 余额
  const decryptCoin2Balance = async () => {
    if (!address || !zamaInstance || !signer) {
      alert('请等待初始化完成并连接钱包');
      return;
    }

    setDecryptingCoin2(true);
    try {
      // 调用 FHE 解密服务
      const balance = await FHEService.decryptBalance('ConfidentialCoin2', address, zamaInstance,await signer);
      setConfidentialBalances(prev => ({ ...prev, coin2: balance }));

      // alert(`ConfidentialCoin2 余额解密成功: ${balance}`);
    } catch (error) {
      console.error('解密 ConfidentialCoin2 余额失败:', error);
      alert('解密失败，请重试: ' + error.message);
    }
    setDecryptingCoin2(false);
  };

  // 清除解密数据
  const clearDecryptedData = () => {
    setConfidentialBalances({ coin1: null, coin2: null });
  };

  useEffect(() => {
    if (address) {
      loadPublicBalances();
    }
  }, [address]);

  if (!address) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        请先连接钱包查看余额
      </div>
    );
  }

  if (zamaLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        初始化加密服务中...
      </div>
    );
  }

  if (zamaError) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
        加密服务初始化失败: {zamaError}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>我的钱包余额</h2>
        <button
          onClick={loadPublicBalances}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#9ca3af' : '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? '🔄 刷新中...' : '🔄 刷新余额'}
        </button>
      </div>

      {/* 当前钱包地址 */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>钱包地址</h4>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#6b7280',
          wordBreak: 'break-all'
        }}>
          {address}
        </div>
      </div>

      {/* 公开代币余额 */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        marginBottom: '24px'
      }}>
        <h3 style={{ color: '#374151', margin: '0 0 20px 0' }}>💰 公开代币余额</h3>

        {balances ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* TestToken 余额 */}
            <div style={{
              padding: '16px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#166534', margin: '0 0 8px 0' }}>🪙 TestToken</h4>
              <p style={{ color: '#166534', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                {Number(balances.testToken).toLocaleString()} TEST
              </p>
            </div>

            {/* TestNFT 余额 */}
            <div style={{
              padding: '16px',
              backgroundColor: '#faf5ff',
              border: '1px solid #d8b4fe',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#7c3aed', margin: '0 0 8px 0' }}>🎨 TestNFT</h4>
              <p style={{ color: '#7c3aed', margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold' }}>
                {balances.testNFT} NFTs
              </p>
              {balances.testNFTs.length > 0 && (
                <div style={{ fontSize: '12px', color: '#7c3aed' }}>
                  Token IDs: {balances.testNFTs.map(nft => `#${nft.tokenId}`).join(', ')}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
            {loading ? '加载中...' : '暂无数据'}
          </div>
        )}
      </div>

      {/* 加密代币余额 */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#374151', margin: 0 }}>🔐 加密代币余额</h3>
          {(confidentialBalances.coin1 || confidentialBalances.coin2) && (
            <button
              onClick={clearDecryptedData}
              style={{
                padding: '6px 12px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              清除解密数据
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* ConfidentialCoin1 */}
          <div style={{
            padding: '20px',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#92400e', margin: '0 0 12px 0' }}>🔐 ConfidentialCoin1</h4>

            {confidentialBalances.coin1 ? (
              <div>
                <p style={{ color: '#92400e', margin: '0 0 12px 0', fontSize: '20px', fontWeight: 'bold' }}>
                  {Number(confidentialBalances.coin1).toLocaleString()} CC1
                </p>
                <div style={{ fontSize: '12px', color: '#92400e' }}>
                  ✅ 已解密显示
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: '#92400e', margin: '0 0 12px 0', fontSize: '16px' }}>
                  余额已加密 🔒
                </p>
                <button
                  onClick={decryptCoin1Balance}
                  disabled={decryptingCoin1}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: decryptingCoin1 ? '#9ca3af' : '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: decryptingCoin1 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {decryptingCoin1 ? '解密中...' : '🔓 点击解密'}
                </button>
              </div>
            )}
          </div>

          {/* ConfidentialCoin2 */}
          <div style={{
            padding: '20px',
            backgroundColor: '#fef2f2',
            border: '1px solid #ef4444',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#dc2626', margin: '0 0 12px 0' }}>🔐 ConfidentialCoin2</h4>

            {confidentialBalances.coin2 ? (
              <div>
                <p style={{ color: '#dc2626', margin: '0 0 12px 0', fontSize: '20px', fontWeight: 'bold' }}>
                  {Number(confidentialBalances.coin2).toLocaleString()} CC2
                </p>
                <div style={{ fontSize: '12px', color: '#dc2626' }}>
                  ✅ 已解密显示
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: '#dc2626', margin: '0 0 12px 0', fontSize: '16px' }}>
                  余额已加密 🔒
                </p>
                <button
                  onClick={decryptCoin2Balance}
                  disabled={decryptingCoin2}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: decryptingCoin2 ? '#9ca3af' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: decryptingCoin2 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {decryptingCoin2 ? '解密中...' : '🔓 点击解密'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 解密说明 */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#eff6ff',
          border: '1px solid #3b82f6',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#1e40af'
        }}>
          <strong>🔒 关于加密代币:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>基于 Zama FHE 技术，余额完全加密存储</li>
            <li>只有钱包所有者可以解密查看真实余额</li>
            <li>解密过程在本地进行，保护隐私安全</li>
            <li>解密数据仅在当前会话有效</li>
          </ul>
        </div>
      </div>

      {/* 合约地址信息 */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '20px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}>
        <h4 style={{ color: '#374151', margin: '0 0 12px 0' }}>📋 合约地址</h4>
        <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
          <div><strong>ConfidentialCoin1:</strong> <span style={{ fontFamily: 'monospace' }}>{CONTRACT_ADDRESSES.ConfidentialCoin1}</span></div>
          <div><strong>ConfidentialCoin2:</strong> <span style={{ fontFamily: 'monospace' }}>{CONTRACT_ADDRESSES.ConfidentialCoin2}</span></div>
          <div><strong>TestToken:</strong> <span style={{ fontFamily: 'monospace' }}>{CONTRACT_ADDRESSES.TestToken}</span></div>
          <div><strong>TestNFT:</strong> <span style={{ fontFamily: 'monospace' }}>{CONTRACT_ADDRESSES.TestNFT}</span></div>
        </div>
      </div>
    </div>
  );
}