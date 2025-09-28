# 🕳️ InvisibleDrop - Privacy-Preserving Airdrop Platform

[![License](https://img.shields.io/badge/License-BSD_3--Clause--Clear-blue.svg)](LICENSE)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.26.0-yellow.svg)](https://hardhat.org/)
[![Zama FHEVM](https://img.shields.io/badge/Zama-FHEVM-green.svg)](https://zama.ai/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)

**InvisibleDrop** is an innovative privacy-preserving airdrop platform built on **Zama's Fully Homomorphic Encryption (FHE)** technology. Through advanced cryptographic techniques, it ensures complete privacy and confidentiality throughout the entire airdrop process. Users can securely check eligibility and claim airdrop tokens without exposing their personal asset information.

## 🎯 Project Overview

InvisibleDrop revolutionarily solves the privacy leakage problems of traditional airdrop platforms. Through Zama FHEVM's Fully Homomorphic Encryption technology, the platform achieves:

- **🔒 Complete Privacy Protection**: User asset information remains encrypted throughout the entire process
- **🎁 Flexible Airdrop Configuration**: Support for airdrops based on NFT holdings, token balances, and other multiple conditions
- **⚡ Real-time Eligibility Checking**: Users can instantly check their airdrop eligibility
- **🔐 Confidential Claiming Process**: Claim amounts and timestamps are stored using encryption
- **💰 Secure Fund Management**: Airdrop creators can safely deposit and withdraw tokens

## 🌟 Core Advantages

### 1. Privacy First 🛡️
- **Zero-Knowledge Verification**: Users verify eligibility without exposing specific asset amounts
- **Encrypted Storage**: All sensitive data is end-to-end encrypted through FHE technology
- **Anonymous Claiming**: The claiming process doesn't reveal users' financial status

### 2. Cutting-Edge Technology 🚀
- **Fully Homomorphic Encryption**: Among the first real-world applications using Zama FHEVM
- **On-chain Privacy Computing**: Direct privacy-preserving computation on blockchain
- **MEV Protection**: Prevention against Miner Extractable Value attacks

### 3. Optimized User Experience ✨
- **One-Click Checking**: Simple and intuitive eligibility checking process
- **Real-time Feedback**: Instant display of airdrop status and error information
- **Multi-Wallet Support**: Support for mainstream Web3 wallets through RainbowKit

### 4. High Flexibility 🔧
- **Multi-Condition Combinations**: Support for composite conditions like NFT+token requirements
- **Time Management**: Precise control over airdrop start and end times
- **Batch Management**: Airdrop creators can manage multiple airdrop campaigns simultaneously

## 🛠️ Technical Architecture

### Core Technology Stack

#### Smart Contract Layer
- **🔐 Zama FHEVM v0.8.0**: Fully Homomorphic Encryption Virtual Machine for on-chain privacy computing
- **⚙️ Hardhat v2.26.0**: Smart contract development, testing, and deployment framework
- **🪙 OpenZeppelin**: Audited security contract library
- **📜 Solidity ^0.8.24**: Smart contract programming language

#### Frontend Technology Stack
- **⚛️ React v19.1.1**: Modern user interface framework
- **⚡ Vite v7.1.6**: Next-generation frontend build tool
- **🔗 Viem v2.37.6**: Type-safe Ethereum client
- **🌈 RainbowKit v2.2.8**: Elegant Web3 wallet connection solution
- **📡 Wagmi v2.17.0**: React Hooks for Ethereum
- **🔑 Zama Relayer SDK v0.2.0**: Relay service for FHE operations

#### Cryptographic Foundation
- **🔐 tfhe-rs**: High-performance Fully Homomorphic Encryption library
- **🔑 Threshold FHE**: Threshold cryptography-based key management
- **🌐 Gateway Chain**: Zama protocol's cross-chain bridge

### System Architecture Diagram

```
User Interface (React + RainbowKit)
        ↓
Zama Relayer SDK
        ↓
FHEVM Smart Contracts (Sepolia Testnet)
        ↓
Fully Homomorphic Encryption Computing Layer
        ↓
Zama Protocol Infrastructure
```

## 🚨 Core Problems Solved

### 1. Privacy Leakage Issues
**Traditional Problem**: Existing airdrop platforms require users to publicly disclose asset information for eligibility verification
**Solution**: Privacy-preserving eligibility verification through FHE technology, keeping user asset information always encrypted

### 2. MEV Attack Risks
**Traditional Problem**: Public transaction information is easily exploited by MEV bots
**Solution**: Encrypted transaction data makes it impossible for MEV bots to predict and exploit transaction information

### 3. Unfair Competition
**Traditional Problem**: Transparent whale information leads to unfair competition
**Solution**: All participants' asset information is encrypted, ensuring a fair competitive environment

### 4. Compliance Requirements
**Traditional Problem**: Privacy regulations in certain regions require protection of user financial privacy
**Solution**: End-to-end encryption ensures compliance with the strictest privacy protection regulations

## 📋 Feature Highlights

### Airdrop Creator Features 🎪

#### Airdrop Creation and Management
- **🆕 Create Airdrops**: Set token contracts, reward amounts, and end times
- **📋 Condition Configuration**:
  - NFT holding requirements (specify NFT contract addresses)
  - Token balance requirements (minimum holding amounts)
  - Time window controls
- **💰 Fund Management**:
  - Deposit ConfidentialFungibleTokens to contracts
  - Withdraw unclaimed remaining tokens
  - Real-time airdrop status monitoring

#### Advanced Control Features
- **⏸️ Pause/Resume**: Pause or resume airdrop activities at any time
- **📊 Data Analytics**: View participation numbers and claiming statistics
- **🔧 Parameter Adjustment**: Dynamically adjust airdrop parameters

### User Features 👥

#### Eligibility Checking and Claiming
- **🔍 Privacy Checking**: Check airdrop eligibility without exposing assets
- **💎 Secure Claiming**: One-click claim encrypted tokens to personal wallet
- **📈 Balance Management**: View encrypted token balances (requires decryption permissions)
- **⏰ Historical Records**: View historical airdrop participation records

#### Smart Notification Features
- **🔔 Eligibility Alerts**: Automatic notifications when eligible
- **⏱️ Deadline Reminders**: Smart reminders before airdrop ends
- **❌ Error Handling**: Detailed error codes and handling suggestions

## 📂 Project Structure

```
InvisibleDrop/
├── 📁 contracts/              # Smart contract source code
│   ├── 🎯 InvisibleDrop.sol      # Main airdrop contract
│   ├── 🪙 ConfidentialCoin1.sol   # Example privacy token 1
│   ├── 🪙 ConfidentialCoin2.sol   # Example privacy token 2
│   ├── 🎨 TestNFT.sol             # Test NFT contract
│   └── 💰 TestToken.sol           # Test token contract
├── 📁 deploy/                # Deployment scripts
├── 📁 tasks/                 # Hardhat task scripts
├── 📁 test/                  # Smart contract tests
├── 📁 app/                   # Frontend dApp application
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   │   ├── 🎪 AirdropManager.tsx    # Airdrop management component
│   │   │   ├── 📜 AirdropList.tsx       # Airdrop list component
│   │   │   ├── 💰 BalanceViewer.tsx     # Balance viewing component
│   │   │   ├── 🎨 TokenMinter.tsx       # Token minting component
│   │   │   └── 🧭 Header.tsx            # Page header component
│   │   ├── 📁 contracts/        # Contract ABIs and addresses
│   │   ├── 📁 utils/           # Utility functions
│   │   └── 📁 config/          # Configuration files
├── 📁 docs/                  # Technical documentation
│   ├── 📖 zama_llm.md           # Zama FHE development guide
│   └── 📖 zama_doc_relayer.md   # Relayer SDK documentation
├── 📁 deployments/           # Deployment records and ABIs
└── 📄 CLAUDE.md             # AI assistant development guide
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: >= 20.0.0
- **npm**: >= 7.0.0
- **Git**: Latest version
- **MetaMask**: Or other Web3 wallet

### Installation and Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/InvisibleDrop.git
cd InvisibleDrop
```

#### 2. Install Dependencies
```bash
# Install main project dependencies
npm install

# Install frontend dependencies
cd app
npm install
cd ..
```

#### 3. Environment Configuration
```bash
# Copy environment variables template
cp .env.example .env

# Set necessary environment variables
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
npx hardhat vars set ETHERSCAN_API_KEY  # Optional
```

#### 4. Compile Contracts
```bash
npm run compile
```

#### 5. Run Tests
```bash
# Local testing
npm run test

# Sepolia testnet testing
npm run test:sepolia
```

#### 6. Deploy Contracts
```bash
# Deploy to local network
npx hardhat node                    # Run in new terminal
npx hardhat deploy --network localhost

# Deploy to Sepolia testnet
npx hardhat deploy --network sepolia
```

#### 7. Start Frontend
```bash
cd app
npm run dev
```

Visit `http://localhost:5173` to start using the dApp!

## 📊 Contract Addresses (Sepolia Testnet)

```
📍 Network: Sepolia Testnet (Chain ID: 11155111)

🎯 Main Contracts:
├── InvisibleDrop: 0x[Update after deployment]
├── ConfidentialCoin1: 0x[Update after deployment]
├── ConfidentialCoin2: 0x[Update after deployment]
├── TestNFT: 0x[Update after deployment]
└── TestToken: 0x[Update after deployment]

🔧 Zama Infrastructure:
├── ACL_CONTRACT: 0x687820221192C5B662b25367F70076A37bc79b6c
├── KMS_VERIFIER: 0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC
├── INPUT_VERIFIER: 0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4
├── DECRYPTION_ORACLE: 0xa02Cda4Ca3a71D7C46997716F4283aa851C28812
└── RELAYER_URL: https://relayer.testnet.zama.cloud
```

## 📋 Available Scripts

### Smart Contract Scripts
| Script Command | Description |
|----------------|-------------|
| `npm run compile` | Compile all smart contracts |
| `npm run test` | Run local test suite |
| `npm run test:sepolia` | Run tests on Sepolia testnet |
| `npm run coverage` | Generate coverage report |
| `npm run lint` | Run code linting and formatting |
| `npm run clean` | Clean build artifacts |

### Frontend Scripts
| Script Command | Description |
|----------------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production version |
| `npm run preview` | Preview production build |
| `npm run lint` | Frontend code linting |

## 🔧 Development Guide

### Smart Contract Development

#### Creating New Airdrop Types
```solidity
// Inherit from base airdrop contract
contract CustomAirdrop is InvisibleDrop {
    // Add custom logic
    function customEligibilityCheck(address user) internal view returns (bool) {
        // Implement custom eligibility checking logic
    }
}
```

#### FHE Operations Best Practices
```solidity
// Correct encrypted data handling
euint64 encryptedAmount = FHE.asEuint64(amount);
FHE.allowThis(encryptedAmount);
FHE.allow(encryptedAmount, userAddress);

// Avoid FHE operations in loops
// Use FHE.select for conditional logic
euint64 result = FHE.select(condition, valueIfTrue, valueIfFalse);
```

### Frontend Development

#### Integrating New Airdrop Components
```typescript
import { useAirdropContract } from './hooks/useAirdropContract';

export function CustomAirdropComponent() {
  const { claimReward, checkEligibility } = useAirdropContract();

  return (
    <div>
      {/* Component UI */}
    </div>
  );
}
```

#### FHE Data Encryption and Decryption
```typescript
import { createInstance } from '@zama-fhe/relayer-sdk';

// Create encrypted input
const instance = await createInstance(config);
const input = instance.createEncryptedInput(contractAddress, userAddress);
input.add64(BigInt(amount));
const encryptedInput = await input.encrypt();

// User data decryption
const decryptedValue = await instance.userDecrypt(
  handleContractPairs,
  keypair.privateKey,
  keypair.publicKey,
  signature,
  contractAddresses,
  userAddress,
  startTimeStamp,
  durationDays
);
```

## 🛣️ Development Roadmap

### Phase 1: Foundation Platform (Completed) ✅
- [x] Basic airdrop contract development
- [x] FHE integration and privacy protection
- [x] Frontend dApp development
- [x] Sepolia testnet deployment
- [x] Basic functionality testing

### Phase 2: Feature Enhancement (In Progress) 🔄
- [ ] **Multi-Chain Support**: Expand to Polygon, BSC, and other networks
- [ ] **Advanced Conditions**:
  - DeFi protocol participation checks
  - Social media verification integration
  - Composite condition logic builder
- [ ] **Batch Operations**:
  - Batch airdrop creation
  - Batch user imports
  - Smart contract automation
- [ ] **Data Analytics**:
  - Airdrop effectiveness analysis dashboard
  - User engagement statistics
  - ROI analysis tools

### Phase 3: Ecosystem Building (Planned) 📋
- [ ] **Developer Tools**:
  - SDK and API interfaces
  - Plugin marketplace
  - Template library
- [ ] **Governance Mechanisms**:
  - DAO governance integration
  - Community voting features
  - Proposal systems
- [ ] **Enterprise Features**:
  - White-label solutions
  - Enterprise APIs
  - Compliance tools

### Phase 4: Ecosystem Expansion (Future) 🚀
- [ ] **Cross-Chain Interoperability**:
  - Cross-chain airdrop support
  - Unified identity verification
  - Multi-chain asset aggregation
- [ ] **AI Integration**:
  - Intelligent recommendation systems
  - Fraud detection
  - Automated customer service
- [ ] **Metaverse Integration**:
  - Virtual space airdrops
  - NFT gamification
  - Immersive experiences

## 🔐 Security Considerations

### Smart Contract Security
- **✅ Reentrancy Attack Protection**: Use ReentrancyGuard to prevent reentrancy attacks
- **✅ Integer Overflow Protection**: Use SafeMath library and Solidity 0.8+ built-in protection
- **✅ Access Control**: Strict permission management and role separation
- **✅ Timelock Mechanisms**: Time delays required for critical operations

### FHE-Specific Security
- **🔐 Key Management**: Use Zama's threshold key management system
- **🛡️ Side-Channel Attack Protection**: Information leakage protection during FHE computations
- **🔒 ACL Permission Control**: Precise Access Control List management

### Frontend Security
- **🌐 CSP Policy**: Content Security Policy to prevent XSS attacks
- **🔑 Wallet Security**: Secure private key management and signature verification
- **📡 Communication Encryption**: All API communications use HTTPS

## 🧪 Testing Guide

### Running Complete Test Suite
```bash
# Local testing
npm run test

# Generate coverage report
npm run coverage

# Sepolia testnet integration testing
npm run test:sepolia
```

### Test Case Structure
```
test/
├── 📁 unit/                 # Unit tests
│   ├── InvisibleDrop.test.ts
│   └── ConfidentialCoin.test.ts
├── 📁 integration/          # Integration tests
│   ├── AirdropFlow.test.ts
│   └── FHEOperations.test.ts
└── 📁 e2e/                  # End-to-end tests
    └── UserJourney.test.ts
```

## 🤝 Contributing Guide

### Development Process
1. **Fork the project** to your GitHub account
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push branch**: `git push origin feature/amazing-feature`
5. **Create Pull Request**

### Code Standards
- **Solidity**: Follow Solidity Style Guide
- **TypeScript**: Use ESLint and Prettier
- **Commit Messages**: Use Conventional Commits specification
- **Test Coverage**: New features require >=90% test coverage

### Issue Reporting
When submitting issues, please include:
- Detailed problem description
- Reproduction steps
- Expected vs actual behavior
- Environment information (Node version, network, etc.)

## 📚 Resources and Documentation

### Official Documentation
- **[Zama FHEVM Documentation](https://docs.zama.ai/fhevm)**: Comprehensive guide to Fully Homomorphic Encryption Virtual Machine
- **[Hardhat Documentation](https://hardhat.org/docs)**: Smart contract development framework
- **[React Documentation](https://react.dev/)**: Official frontend framework documentation

### Learning Resources
- **[FHE Getting Started Guide](docs/zama_llm.md)**: FHE development guide in this project
- **[Relayer SDK Guide](docs/zama_doc_relayer.md)**: Detailed frontend integration instructions
- **[Solidity Best Practices](https://docs.soliditylang.org/)**: Secure smart contract development

### Community Support
- **[GitHub Discussions](https://github.com/zama-ai/fhevm/discussions)**: Technical discussions and Q&A
- **[Discord Community](https://discord.gg/zama)**: Real-time communication and support
- **[Forum](https://community.zama.ai/)**: In-depth technical discussions

## 📄 License

This project is licensed under the **BSD-3-Clause-Clear** license. For detailed information, please see the [LICENSE](LICENSE) file.

### License Highlights
- ✅ Commercial use
- ✅ Modification and distribution
- ✅ Private use
- ❌ Liability and warranty disclaimers
- ❌ Must retain copyright notices

## 🆘 Support & Contact

### Getting Help
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/your-username/InvisibleDrop/issues)
- **💡 Feature Requests**: [GitHub Issues](https://github.com/your-username/InvisibleDrop/issues)
- **📧 Business Partnerships**: business@example.com
- **💬 Technical Support**: support@example.com

### Social Media
- **🐦 Twitter**: [@InvisibleDrop](https://twitter.com/InvisibleDrop)
- **📱 Telegram**: [t.me/InvisibleDrop](https://t.me/InvisibleDrop)
- **📰 Blog**: [blog.invisibledrop.io](https://blog.invisibledrop.io)

### Technical Communication
- **⚡ Lightning Talks**: Regular technical sharing sessions
- **🎓 Workshops**: Developer training and workshops
- **🏆 Hackathons**: Participation in blockchain hackathons

---

<div align="center">

**🌟 If this project helps you, please give us a Star! 🌟**

**Built with ❤️ by the InvisibleDrop Team**

[⬆ Back to Top](#-invisibledrop---privacy-preserving-airdrop-platform)

</div>