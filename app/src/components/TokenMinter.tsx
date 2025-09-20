import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { TokenService } from '../services/tokens';
import { CONTRACT_ADDRESSES } from '../contracts/contracts';

interface UserBalances {
  testToken: string;
  testNFT: number;
  testNFTs: Array<{tokenId: string, uri: string}>;
}

export function TokenMinter() {
  const { address } = useAccount();
  const [loading, setLoading] = useState<string | null>(null);
  const [balances, setBalances] = useState<UserBalances | null>(null);

  // 表单状态
  const [testTokenAmount, setTestTokenAmount] = useState('1000');
  const [nftUri, setNftUri] = useState('https://example.com/token/');
  const [confidentialCoin1Amount, setConfidentialCoin1Amount] = useState('5000');
  const [confidentialCoin2Amount, setConfidentialCoin2Amount] = useState('5000');
  const [depositAmount, setDepositAmount] = useState('1000');
  const [selectedToken, setSelectedToken] = useState<'ConfidentialCoin1' | 'ConfidentialCoin2'>('ConfidentialCoin1');

  // 加载用户余额
  const loadBalances = async () => {
    if (!address) return;

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
  };

  // 铸造 TestToken
  const handleMintTestToken = async () => {
    if (!address) return;

    try {
      setLoading('testToken');
      const result = await TokenService.mintTestToken(address, testTokenAmount);

      if (result.success) {
        alert(result.message);
        await loadBalances();
        setTestTokenAmount('1000');
      } else {
        alert(`铸造失败: ${result.error}`);
      }
    } catch (error) {
      console.error('铸造 TestToken 失败:', error);
      alert('铸造失败');
    } finally {
      setLoading(null);
    }
  };

  // 铸造 TestNFT
  const handleMintTestNFT = async () => {
    if (!address) return;

    try {
      setLoading('testNFT');
      const result = await TokenService.mintTestNFT(address, nftUri);

      if (result.success) {
        alert(result.message);
        await loadBalances();
        setNftUri('https://example.com/token/');
      } else {
        alert(`铸造失败: ${result.error}`);
      }
    } catch (error) {
      console.error('铸造 TestNFT 失败:', error);
      alert('铸造失败');
    } finally {
      setLoading(null);
    }
  };

  // 铸造 ConfidentialCoin1
  const handleMintConfidentialCoin1 = async () => {
    if (!address) return;

    try {
      setLoading('coin1');
      const result = await TokenService.mintConfidentialCoin1(address, Number(confidentialCoin1Amount));

      if (result.success) {
        alert(result.message);
        setConfidentialCoin1Amount('5000');
      } else {
        alert(`铸造失败: ${result.error}`);
      }
    } catch (error) {
      console.error('铸造 ConfidentialCoin1 失败:', error);
      alert('铸造失败');
    } finally {
      setLoading(null);
    }
  };

  // 铸造 ConfidentialCoin2
  const handleMintConfidentialCoin2 = async () => {
    if (!address) return;

    try {
      setLoading('coin2');
      const result = await TokenService.mintConfidentialCoin2(address, Number(confidentialCoin2Amount));

      if (result.success) {
        alert(result.message);
        setConfidentialCoin2Amount('5000');
      } else {
        alert(`铸造失败: ${result.error}`);
      }
    } catch (error) {
      console.error('铸造 ConfidentialCoin2 失败:', error);
      alert('铸造失败');
    } finally {
      setLoading(null);
    }
  };

  // 给空投合约充值
  const handleDepositToAirdrop = async () => {
    try {
      setLoading('deposit');
      const result = await TokenService.depositToAirdrop(selectedToken, depositAmount);

      if (result.success) {
        alert(result.message);
        setDepositAmount('1000');
      } else {
        alert(`充值失败: ${result.error}`);
      }
    } catch (error) {
      console.error('充值到空投合约失败:', error);
      alert('充值失败');
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    if (address) {
      loadBalances();
    }
  }, [address]);

  if (!address) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        请先连接钱包
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>代币铸造</h2>
        <button
          onClick={loadBalances}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 刷新余额
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* 左列 - 铸造功能 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* TestToken 铸造 */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#374151', margin: '0 0 16px 0' }}>🪙 TestToken</h3>
            <p style={{ color: '#6b7280', margin: '0 0 16px 0', fontSize: '14px' }}>
              用于测试的 ERC20 代币，可作为空投条件
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: 'bold' }}>
                铸造数量
              </label>
              <input
                type="number"
                value={testTokenAmount}
                onChange={(e) => setTestTokenAmount(e.target.value)}
                min="1"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="1000"
              />
            </div>

            <button
              onClick={handleMintTestToken}
              disabled={loading === 'testToken'}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading === 'testToken' ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading === 'testToken' ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading === 'testToken' ? '铸造中...' : '铸造 TestToken'}
            </button>
          </div>

          {/* TestNFT 铸造 */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#374151', margin: '0 0 16px 0' }}>🎨 TestNFT</h3>
            <p style={{ color: '#6b7280', margin: '0 0 16px 0', fontSize: '14px' }}>
              用于测试的 ERC721 NFT，可作为空投条件
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: 'bold' }}>
                Token URI
              </label>
              <input
                type="url"
                value={nftUri}
                onChange={(e) => setNftUri(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="https://example.com/token/"
              />
            </div>

            <button
              onClick={handleMintTestNFT}
              disabled={loading === 'testNFT'}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading === 'testNFT' ? '#9ca3af' : '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading === 'testNFT' ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading === 'testNFT' ? '铸造中...' : '铸造 TestNFT'}
            </button>
          </div>

          {/* 空投合约充值 */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#374151', margin: '0 0 16px 0' }}>🎁 空投合约充值</h3>
            <p style={{ color: '#6b7280', margin: '0 0 16px 0', fontSize: '14px' }}>
              直接向空投合约mint代币，用于空投奖励分发
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: 'bold' }}>
                  选择代币类型
                </label>
                <select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value as 'ConfidentialCoin1' | 'ConfidentialCoin2')}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="ConfidentialCoin1">ConfidentialCoin1</option>
                  <option value="ConfidentialCoin2">ConfidentialCoin2</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: 'bold' }}>
                  充值数量
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="1000"
                />
              </div>

              <button
                onClick={handleDepositToAirdrop}
                disabled={loading === 'deposit'}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: loading === 'deposit' ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading === 'deposit' ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading === 'deposit' ? '充值中...' : '充值到空投合约'}
              </button>

              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                <strong>目标地址:</strong><br />
                <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {CONTRACT_ADDRESSES.InvisibleDrop}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 右列 - 余额显示 */}
        <div>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            height: 'fit-content'
          }}>
            <h3 style={{ color: '#374151', margin: '0 0 16px 0' }}>💰 我的余额</h3>

            {balances ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* TestToken 余额 */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#166534', margin: '0 0 8px 0' }}>🪙 TestToken</h4>
                  <p style={{ color: '#166534', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
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
                  <p style={{ color: '#7c3aed', margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>
                    {balances.testNFT} NFTs
                  </p>
                  {balances.testNFTs.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#7c3aed' }}>
                      Token IDs: {balances.testNFTs.map(nft => `#${nft.tokenId}`).join(', ')}
                    </div>
                  )}
                </div>

                {/* ConfidentialCoin 提示 */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#92400e', margin: '0 0 8px 0' }}>🔐 ConfidentialCoin</h4>
                  <p style={{ color: '#92400e', margin: 0, fontSize: '14px' }}>
                    隐私代币余额已加密，无法直接显示
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                加载中...
              </div>
            )}
          </div>

          {/* 提示信息 */}
          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#eff6ff',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            color: '#1e40af'
          }}>
            <h4 style={{ margin: '0 0 8px 0' }}>💡 使用提示</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>TestToken 和 TestNFT 可用作空投的领取条件</li>
              <li>ConfidentialCoin 用作空投的奖励代币</li>
              <li>所有代币都部署在 Sepolia 测试网</li>
              <li>铸造是免费的，仅需支付 Gas 费用</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}