import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { AirdropManager } from './AirdropManager';
import { TokenMinter } from './TokenMinter';
import { AirdropList } from './AirdropList';
import { BalanceViewer } from './BalanceViewer';

export function InvisibleDropApp() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'airdrops' | 'create' | 'mint' | 'balance'>('airdrops');

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px 0',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>
            💧 InvisibleDrop
          </h1>
          <p style={{
            color: '#6b7280',
            margin: '5px 0 0 0'
          }}>
            隐私空投平台 - 基于 Zama FHE 技术
          </p>
        </div>
        <ConnectButton />
      </header>

      {!isConnected ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ color: '#374151', marginBottom: '16px' }}>
            欢迎使用 InvisibleDrop
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            请连接钱包开始使用隐私空投功能
          </p>
          <ConnectButton />
        </div>
      ) : (
        <div>
          {/* Tab Navigation */}
          <nav style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {[
              { key: 'airdrops', label: '🎯 空投列表' },
              { key: 'create', label: '➕ 创建空投' },
              { key: 'mint', label: '🪙 铸造代币' },
              { key: 'balance', label: '💰 我的余额' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: activeTab === key ? '#3b82f6' : 'transparent',
                  color: activeTab === key ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontWeight: activeTab === key ? 'bold' : 'normal',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== key) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== key) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div style={{ minHeight: '500px' }}>
            {activeTab === 'airdrops' && <AirdropList />}
            {activeTab === 'create' && <AirdropManager />}
            {activeTab === 'mint' && <TokenMinter />}
            {activeTab === 'balance' && <BalanceViewer />}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        <p>
          InvisibleDrop - 基于 Zama FHE 的隐私空投平台 |
          <a
            href="https://docs.zama.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#3b82f6', marginLeft: '8px' }}
          >
            了解 Zama
          </a>
        </p>
        <p style={{ marginTop: '8px' }}>
          Sepolia 测试网 | 合约地址: 0xCb96848DD60c987e67D406A3da966F63270dbA7b
        </p>
      </footer>
    </div>
  );
}