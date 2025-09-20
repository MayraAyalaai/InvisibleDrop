import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { InvisibleDropService } from '../services/invisibleDrop';
import type{  AirdropInfo, AirdropConditions, UserClaimInfo } from '../services/invisibleDrop';

interface AirdropData extends AirdropInfo {
  id: number;
  conditions: AirdropConditions | null;
  userClaimInfo: UserClaimInfo | null;
  isEligible: boolean;
  claimableAmount: number;
  canClaim: boolean;
}

export function AirdropList() {
  const { address } = useAccount();
  const [airdrops, setAirdrops] = useState<AirdropData[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingAirdropId, setClaimingAirdropId] = useState<number | null>(null);

  // 加载空投列表
  const loadAirdrops = async () => {
    if (!address) return;

    try {
      setLoading(true);
      const count = await InvisibleDropService.getAirdropCount();
      const airdropPromises = [];

      for (let i = 0; i < count; i++) {
        airdropPromises.push(loadSingleAirdrop(i));
      }

      const airdropData = await Promise.all(airdropPromises);
      setAirdrops(airdropData.filter(Boolean) as AirdropData[]);
    } catch (error) {
      console.error('加载空投列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载单个空投信息
  const loadSingleAirdrop = async (airdropId: number): Promise<AirdropData | null> => {
    if (!address) return null;

    try {
      const [info, conditions, userClaimInfo, isEligible, claimableAmount] = await Promise.all([
        InvisibleDropService.getAirdropInfo(airdropId),
        InvisibleDropService.getAirdropConditions(airdropId),
        InvisibleDropService.getUserClaimInfo(airdropId, address),
        InvisibleDropService.checkEligibility(airdropId, address),
        InvisibleDropService.checkClaimableAmount(airdropId, address)
      ]);

      if (!info) return null;

      const canClaim = isEligible && !userClaimInfo?.hasClaimed && claimableAmount > 0 && info.isActive;

      return {
        id: airdropId,
        ...info,
        conditions,
        userClaimInfo,
        isEligible,
        claimableAmount,
        canClaim
      };
    } catch (error) {
      console.error(`加载空投 ${airdropId} 失败:`, error);
      return null;
    }
  };

  // 领取奖励
  const handleClaim = async (airdropId: number) => {
    try {
      setClaimingAirdropId(airdropId);
      const result = await InvisibleDropService.claimReward(airdropId);

      if (result.success) {
        alert(result.message);
        // 重新加载空投列表
        await loadAirdrops();
      } else {
        alert(`领取失败: ${result.error}`);
      }
    } catch (error) {
      console.error('领取失败:', error);
      alert('领取失败');
    } finally {
      setClaimingAirdropId(null);
    }
  };

  // 格式化时间
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  };

  // 格式化地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    if (address) {
      loadAirdrops();
    }
  }, [address]);

  if (!address) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        请先连接钱包
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        加载中...
      </div>
    );
  }

  if (airdrops.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        <h3>暂无空投</h3>
        <p>目前还没有任何空投活动</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>空投列表</h2>
        <button
          onClick={loadAirdrops}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 刷新
        </button>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {airdrops.map((airdrop) => (
          <div
            key={airdrop.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#1f2937', margin: '0 0 12px 0' }}>
                  空投 #{airdrop.id}
                  {airdrop.isActive ? (
                    <span style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      marginLeft: '8px'
                    }}>
                      进行中
                    </span>
                  ) : (
                    <span style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      marginLeft: '8px'
                    }}>
                      已结束
                    </span>
                  )}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ margin: '4px 0', color: '#374151' }}>
                      <strong>发起者:</strong> {formatAddress(airdrop.airdropper)}
                    </p>
                    <p style={{ margin: '4px 0', color: '#374151' }}>
                      <strong>奖励代币:</strong> {formatAddress(airdrop.rewardToken)}
                    </p>
                    <p style={{ margin: '4px 0', color: '#374151' }}>
                      <strong>每人奖励:</strong> {airdrop.rewardPerUser} 代币
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '4px 0', color: '#374151' }}>
                      <strong>结束时间:</strong> {formatTime(airdrop.endTime)}
                    </p>
                    <p style={{ margin: '4px 0', color: '#374151' }}>
                      <strong>用户状态:</strong>
                      {airdrop.isEligible ? (
                        <span style={{ color: '#10b981' }}> ✅ 符合条件</span>
                      ) : (
                        <span style={{ color: '#ef4444' }}> ❌ 不符合条件</span>
                      )}
                    </p>
                    <p style={{ margin: '4px 0', color: '#374151' }}>
                      <strong>可领取:</strong> {airdrop.claimableAmount} 代币
                    </p>
                  </div>
                </div>

                {/* 条件信息 */}
                {airdrop.conditions && (
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>领取条件:</h4>
                    {airdrop.conditions.requireNFT && (
                      <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                        🎨 需要持有 NFT: {formatAddress(airdrop.conditions.nftContract)}
                      </p>
                    )}
                    {airdrop.conditions.requireToken && (
                      <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                        🪙 需要持有代币: {formatAddress(airdrop.conditions.tokenContract)} ≥ {airdrop.conditions.minTokenAmount}
                      </p>
                    )}
                    {!airdrop.conditions.requireNFT && !airdrop.conditions.requireToken && (
                      <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                        🎉 无条件限制
                      </p>
                    )}
                  </div>
                )}

                {/* 用户领取状态 */}
                {airdrop.userClaimInfo && airdrop.userClaimInfo.hasClaimed && (
                  <div style={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #d1fae5',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '16px'
                  }}>
                    <p style={{ margin: 0, color: '#065f46' }}>
                      ✅ 已于 {formatTime(airdrop.userClaimInfo.claimTime)} 领取
                    </p>
                  </div>
                )}
              </div>

              {/* 领取按钮 */}
              <div style={{ marginLeft: '20px' }}>
                {airdrop.canClaim ? (
                  <button
                    onClick={() => handleClaim(airdrop.id)}
                    disabled={claimingAirdropId === airdrop.id}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: claimingAirdropId === airdrop.id ? '#9ca3af' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: claimingAirdropId === airdrop.id ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      minWidth: '100px'
                    }}
                  >
                    {claimingAirdropId === airdrop.id ? '领取中...' : '🎁 领取'}
                  </button>
                ) : (
                  <div style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#6b7280',
                    fontSize: '14px',
                    textAlign: 'center',
                    minWidth: '100px'
                  }}>
                    {airdrop.userClaimInfo?.hasClaimed ? '已领取' :
                     !airdrop.isEligible ? '不符合条件' :
                     !airdrop.isActive ? '已结束' : '暂不可领取'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}