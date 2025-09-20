import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { InvisibleDropService } from '../services/invisibleDrop';
import type {AirdropConfig } from '../services/invisibleDrop';
import { CONTRACT_ADDRESSES } from '../contracts/contracts';

export function AirdropManager() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AirdropConfig>({
    rewardToken: CONTRACT_ADDRESSES.ConfidentialCoin1,
    rewardPerUser: 100,
    endTime: Math.floor(Date.now() / 1000) + 86400 * 7, // 7天后
    requireNFT: false,
    nftContract: CONTRACT_ADDRESSES.TestNFT,
    requireToken: false,
    tokenContract: CONTRACT_ADDRESSES.TestToken,
    minTokenAmount: '1000'
  });

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert('请先连接钱包');
      return;
    }

    try {
      setLoading(true);
      const result = await InvisibleDropService.createAirdrop(formData);

      if (result.success) {
        alert(result.message);
        // 重置表单
        setFormData({
          ...formData,
          endTime: Math.floor(Date.now() / 1000) + 86400 * 7
        });
      } else {
        alert(`创建失败: ${result.error}`);
      }
    } catch (error) {
      console.error('创建空投失败:', error);
      alert('创建空投失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: keyof AirdropConfig, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 格式化日期时间输入值
  const formatDateTimeLocal = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // 处理日期时间变化
  const handleDateTimeChange = (value: string) => {
    const timestamp = Math.floor(new Date(value).getTime() / 1000);
    handleInputChange('endTime', timestamp);
  };

  if (!address) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        请先连接钱包
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '24px' }}>创建新空投</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 基础信息 */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          border: '1px solid #e5e7eb',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: '#374151', margin: '0 0 16px 0' }}>基础信息</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: 'bold' }}>
                奖励代币合约地址
              </label>
              <select
                value={formData.rewardToken}
                onChange={(e) => handleInputChange('rewardToken', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value={CONTRACT_ADDRESSES.ConfidentialCoin1}>
                  ConfidentialCoin1 ({CONTRACT_ADDRESSES.ConfidentialCoin1.slice(0, 10)}...)
                </option>
                <option value={CONTRACT_ADDRESSES.ConfidentialCoin2}>
                  ConfidentialCoin2 ({CONTRACT_ADDRESSES.ConfidentialCoin2.slice(0, 10)}...)
                </option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: 'bold' }}>
                每用户奖励数量
              </label>
              <input
                type="number"
                value={formData.rewardPerUser}
                onChange={(e) => handleInputChange('rewardPerUser', Number(e.target.value))}
                min="1"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: 'bold' }}>
                结束时间
              </label>
              <input
                type="datetime-local"
                value={formatDateTimeLocal(formData.endTime)}
                onChange={(e) => handleDateTimeChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                required
              />
            </div>
          </div>
        </div>

        {/* 条件设置 */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          border: '1px solid #e5e7eb',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: '#374151', margin: '0 0 16px 0' }}>领取条件</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* NFT 条件 */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="checkbox"
                  checked={formData.requireNFT}
                  onChange={(e) => handleInputChange('requireNFT', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ color: '#374151', fontWeight: 'bold' }}>需要持有 NFT</span>
              </label>

              {formData.requireNFT && (
                <select
                  value={formData.nftContract}
                  onChange={(e) => handleInputChange('nftContract', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value={CONTRACT_ADDRESSES.TestNFT}>
                    TestNFT ({CONTRACT_ADDRESSES.TestNFT.slice(0, 10)}...)
                  </option>
                </select>
              )}
            </div>

            {/* 代币条件 */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="checkbox"
                  checked={formData.requireToken}
                  onChange={(e) => handleInputChange('requireToken', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ color: '#374151', fontWeight: 'bold' }}>需要持有代币</span>
              </label>

              {formData.requireToken && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <select
                    value={formData.tokenContract}
                    onChange={(e) => handleInputChange('tokenContract', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value={CONTRACT_ADDRESSES.TestToken}>
                      TestToken ({CONTRACT_ADDRESSES.TestToken.slice(0, 10)}...)
                    </option>
                  </select>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#6b7280', fontSize: '14px' }}>
                      最小持有数量
                    </label>
                    <input
                      type="number"
                      value={formData.minTokenAmount}
                      onChange={(e) => handleInputChange('minTokenAmount', e.target.value)}
                      min="0"
                      step="0.1"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '16px',
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '创建中...' : '🚀 创建空投'}
        </button>
      </form>

      {/* 提示信息 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        color: '#92400e'
      }}>
        <h4 style={{ margin: '0 0 8px 0' }}>⚠️ 注意事项</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>创建空投后需要充值奖励代币到合约</li>
          <li>确保奖励代币合约地址正确</li>
          <li>条件设置后无法修改，请仔细检查</li>
          <li>空投创建后立即生效，用户可以开始领取</li>
        </ul>
      </div>
    </div>
  );
}