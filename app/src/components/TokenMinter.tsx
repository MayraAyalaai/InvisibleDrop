import { useState } from 'react';
import { useAccount } from 'wagmi';
import { TokenService } from '../services/tokens';
import { CONTRACT_ADDRESSES } from '../contracts/contracts';

export function TokenMinter() {
  const { address } = useAccount();
  const [loading, setLoading] = useState<string | null>(null);

  // 表单状态
  const [testTokenAmount, setTestTokenAmount] = useState('1000');
  const [nftUri, setNftUri] = useState('https://example.com/token/');
  const [depositAmount, setDepositAmount] = useState('1000');
  const [selectedToken, setSelectedToken] = useState<'ConfidentialCoin1' | 'ConfidentialCoin2'>('ConfidentialCoin1');

  // 铸造 TestToken
  const handleMintTestToken = async () => {
    if (!address) return;

    try {
      setLoading('testToken');
      const result = await TokenService.mintTestToken(address, testTokenAmount);

      if (result.success) {
        alert(result.message);
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


  if (!address) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        Please connect your wallet first
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>Token Minting</h2>
        <p style={{ color: '#6b7280', margin: '8px 0 0 0', fontSize: '14px' }}>
          Mint test tokens and fund airdrop contracts with reward tokens
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>

          {/* TestToken 铸造 */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#374151', margin: '0 0 16px 0' }}>🪙 TestToken</h3>
            <p style={{ color: '#6b7280', margin: '0 0 16px 0', fontSize: '14px' }}>
              ERC20 token for testing, can be used as airdrop conditions
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: 'bold' }}>
                Mint Amount
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
              {loading === 'testToken' ? 'Minting...' : 'Mint TestToken'}
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
              ERC721 NFT for testing, can be used as airdrop conditions
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
              {loading === 'testNFT' ? 'Minting...' : 'Mint TestNFT'}
            </button>
          </div>

          {/* 空投合约充值 */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#374151', margin: '0 0 16px 0' }}>🎁 Airdrop Contract Funding</h3>
            <p style={{ color: '#6b7280', margin: '0 0 16px 0', fontSize: '14px' }}>
              Mint tokens directly to airdrop contract for reward distribution
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: 'bold' }}>
                  Select Token Type
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
                  Fund Amount
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
                {loading === 'deposit' ? 'Funding...' : 'Fund Airdrop Contract'}
              </button>

              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                <strong>Target Address:</strong><br />
                <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {CONTRACT_ADDRESSES.InvisibleDrop}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 使用提示 */}
        <div style={{
          padding: '16px',
          backgroundColor: '#eff6ff',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          color: '#1e40af'
        }}>
          <h4 style={{ margin: '0 0 8px 0' }}>💡 Usage Tips</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
            <li>TestToken and TestNFT can be used as airdrop claiming conditions</li>
            <li>ConfidentialCoin is used as airdrop reward tokens</li>
            <li>Airdrop contract funding can mint tokens directly to contract address</li>
            <li>All tokens are deployed on Sepolia testnet</li>
            <li>Minting is free, only gas fees required</li>
          </ul>
        </div>
    </div>
  );
}