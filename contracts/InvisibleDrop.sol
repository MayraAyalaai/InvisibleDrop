// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/interfaces/IERC721.sol";
import {ConfidentialFungibleToken} from "@openzeppelin/confidential-contracts/token/ConfidentialFungibleToken.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {FHE, euint64, ebool, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";

contract InvisibleDrop is SepoliaConfig {
    // 空投配置结构
    struct AirdropConfig {
        address airdropper;              // 空投发起人
        ConfidentialFungibleToken rewardToken;  // 空投代币合约
        euint64 totalRewards;           // 总奖励数量（加密）
        euint64 remainingRewards;       // 剩余奖励数量（加密）
        euint64 rewardPerUser;          // 每用户奖励数量（加密）
        bool isActive;                  // 空投是否激活
        uint256 endTime;               // 空投结束时间
        
        // 条件配置
        bool requireNFT;               // 是否需要NFT
        address nftContract;           // NFT合约地址
        bool requireToken;             // 是否需要代币
        address tokenContract;         // 代币合约地址
        uint256 minTokenAmount;        // 最小代币持有量
    }

    // 用户领取记录
    struct UserClaim {
        bool hasClaimed;               // 是否已领取
        euint64 claimedAmount;         // 已领取数量（加密）
        uint256 claimTime;            // 领取时间
    }

    // 状态变量
    mapping(uint256 => AirdropConfig) public airdrops;
    mapping(uint256 => mapping(address => UserClaim)) public userClaims;
    uint256 public airdropCount;

    // 错误处理
    euint64 internal NO_ERROR;
    euint64 internal INSUFFICIENT_REWARDS;
    euint64 internal CONDITIONS_NOT_MET;
    euint64 internal ALREADY_CLAIMED;
    euint64 internal AIRDROP_ENDED;

    struct LastError {
        euint64 error;
        uint256 timestamp;
    }
    mapping(address => LastError) private _lastErrors;

    // 事件
    event AirdropCreated(uint256 indexed airdropId, address indexed airdropper, address rewardToken);
    event RewardsDeposited(uint256 indexed airdropId, address indexed airdropper, uint64 amount);
    event RewardClaimed(uint256 indexed airdropId, address indexed user, uint256 timestamp);
    event ErrorChanged(address indexed user);

    constructor() {
        NO_ERROR = FHE.asEuint64(0);
        INSUFFICIENT_REWARDS = FHE.asEuint64(1);
        CONDITIONS_NOT_MET = FHE.asEuint64(2);
        ALREADY_CLAIMED = FHE.asEuint64(3);
        AIRDROP_ENDED = FHE.asEuint64(4);
    }

    // 创建空投
    function createAirdrop(
        address _rewardToken,
        externalEuint64 _rewardPerUser,
        bytes calldata _inputProof,
        uint256 _endTime,
        bool _requireNFT,
        address _nftContract,
        bool _requireToken,
        address _tokenContract,
        uint256 _minTokenAmount
    ) external returns (uint256) {
        euint64 rewardPerUser = FHE.fromExternal(_rewardPerUser, _inputProof);
        
        uint256 airdropId = airdropCount++;
        
        AirdropConfig storage airdrop = airdrops[airdropId];
        airdrop.airdropper = msg.sender;
        airdrop.rewardToken = ConfidentialFungibleToken(_rewardToken);
        airdrop.rewardPerUser = rewardPerUser;
        airdrop.totalRewards = FHE.asEuint64(0);
        airdrop.remainingRewards = FHE.asEuint64(0);
        airdrop.isActive = true;
        airdrop.endTime = _endTime;
        airdrop.requireNFT = _requireNFT;
        airdrop.nftContract = _nftContract;
        airdrop.requireToken = _requireToken;
        airdrop.tokenContract = _tokenContract;
        airdrop.minTokenAmount = _minTokenAmount;

        // 设置访问权限
        FHE.allowThis(rewardPerUser);
        FHE.allow(rewardPerUser, msg.sender);

        emit AirdropCreated(airdropId, msg.sender, _rewardToken);
        return airdropId;
    }

    // 空投方充值代币
    function depositRewards(
        uint256 _airdropId,
        externalEuint64 _amount,
        bytes calldata _inputProof
    ) external {
        require(_airdropId < airdropCount, "Invalid airdrop ID");
        AirdropConfig storage airdrop = airdrops[_airdropId];
        require(msg.sender == airdrop.airdropper, "Only airdropper can deposit");
        require(airdrop.isActive, "Airdrop not active");

        euint64 amount = FHE.fromExternal(_amount, _inputProof);
        
        // 转移代币到合约
        FHE.allowTransient(amount, address(airdrop.rewardToken));
        airdrop.rewardToken.transferFrom(msg.sender, address(this), amount);
        
        // 更新总量和剩余量
        airdrop.totalRewards = FHE.add(airdrop.totalRewards, amount);
        airdrop.remainingRewards = FHE.add(airdrop.remainingRewards, amount);

        // 设置访问权限
        FHE.allowThis(airdrop.totalRewards);
        FHE.allowThis(airdrop.remainingRewards);
        FHE.allow(airdrop.totalRewards, msg.sender);
        FHE.allow(airdrop.remainingRewards, msg.sender);

        emit RewardsDeposited(_airdropId, msg.sender, FHE.decrypt(amount));
    }

    // 检查用户是否满足条件
    function checkEligibility(uint256 _airdropId, address _user) public view returns (bool) {
        require(_airdropId < airdropCount, "Invalid airdrop ID");
        AirdropConfig storage airdrop = airdrops[_airdropId];
        
        // 检查是否已领取
        if (userClaims[_airdropId][_user].hasClaimed) {
            return false;
        }
        
        // 检查空投是否结束
        if (block.timestamp > airdrop.endTime) {
            return false;
        }
        
        // 检查NFT条件
        if (airdrop.requireNFT && airdrop.nftContract != address(0)) {
            IERC721 nft = IERC721(airdrop.nftContract);
            if (nft.balanceOf(_user) == 0) {
                return false;
            }
        }
        
        // 检查代币条件
        if (airdrop.requireToken && airdrop.tokenContract != address(0)) {
            IERC20 token = IERC20(airdrop.tokenContract);
            if (token.balanceOf(_user) < airdrop.minTokenAmount) {
                return false;
            }
        }
        
        return true;
    }

    // 用户查看可领取数量
    function checkClaimableAmount(uint256 _airdropId, address _user) external view returns (euint64) {
        if (checkEligibility(_airdropId, _user)) {
            return airdrops[_airdropId].rewardPerUser;
        } else {
            return FHE.asEuint64(0);
        }
    }

    // 用户领取空投
    function claimReward(uint256 _airdropId) external {
        require(_airdropId < airdropCount, "Invalid airdrop ID");
        AirdropConfig storage airdrop = airdrops[_airdropId];
        
        // 检查基本条件
        ebool isEligible = FHE.asEbool(checkEligibility(_airdropId, msg.sender));
        ebool hasEnoughRewards = FHE.ge(airdrop.remainingRewards, airdrop.rewardPerUser);
        
        // 计算实际领取数量
        ebool canClaim = FHE.and(isEligible, hasEnoughRewards);
        euint64 claimAmount = FHE.select(canClaim, airdrop.rewardPerUser, FHE.asEuint64(0));
        
        // 设置错误代码
        euint64 errorCode = FHE.select(
            canClaim, 
            NO_ERROR,
            FHE.select(
                isEligible,
                INSUFFICIENT_REWARDS,
                CONDITIONS_NOT_MET
            )
        );
        
        setLastError(errorCode, msg.sender);
        
        // 更新状态
        airdrop.remainingRewards = FHE.sub(airdrop.remainingRewards, claimAmount);
        userClaims[_airdropId][msg.sender].hasClaimed = FHE.decrypt(FHE.gt(claimAmount, FHE.asEuint64(0)));
        userClaims[_airdropId][msg.sender].claimedAmount = claimAmount;
        userClaims[_airdropId][msg.sender].claimTime = block.timestamp;
        
        // 转移代币
        if (FHE.decrypt(FHE.gt(claimAmount, FHE.asEuint64(0)))) {
            FHE.allowTransient(claimAmount, address(airdrop.rewardToken));
            airdrop.rewardToken.transfer(msg.sender, claimAmount);
        }
        
        // 设置访问权限
        FHE.allowThis(airdrop.remainingRewards);
        FHE.allow(airdrop.remainingRewards, airdrop.airdropper);
        FHE.allowThis(claimAmount);
        FHE.allow(claimAmount, msg.sender);

        emit RewardClaimed(_airdropId, msg.sender, block.timestamp);
    }

    // 设置错误状态
    function setLastError(euint64 error, address user) private {
        _lastErrors[user] = LastError(error, block.timestamp);
        emit ErrorChanged(user);
    }
    
    // 获取用户最后的错误
    function getLastError(address user) external view returns (euint64, uint256) {
        LastError memory lastError = _lastErrors[user];
        return (lastError.error, lastError.timestamp);
    }

    // 空投方关闭空投
    function deactivateAirdrop(uint256 _airdropId) external {
        require(_airdropId < airdropCount, "Invalid airdrop ID");
        AirdropConfig storage airdrop = airdrops[_airdropId];
        require(msg.sender == airdrop.airdropper, "Only airdropper can deactivate");
        
        airdrop.isActive = false;
    }

    // 空投方提取剩余代币
    function withdrawRemainingRewards(uint256 _airdropId) external {
        require(_airdropId < airdropCount, "Invalid airdrop ID");
        AirdropConfig storage airdrop = airdrops[_airdropId];
        require(msg.sender == airdrop.airdropper, "Only airdropper can withdraw");
        require(!airdrop.isActive || block.timestamp > airdrop.endTime, "Airdrop still active");
        
        euint64 remaining = airdrop.remainingRewards;
        airdrop.remainingRewards = FHE.asEuint64(0);
        
        FHE.allowTransient(remaining, address(airdrop.rewardToken));
        airdrop.rewardToken.transfer(msg.sender, remaining);
        
        FHE.allowThis(airdrop.remainingRewards);
        FHE.allow(airdrop.remainingRewards, msg.sender);
    }

    // 查看函数
    function getAirdropInfo(uint256 _airdropId) external view returns (
        address airdropper,
        address rewardToken,
        euint64 totalRewards,
        euint64 remainingRewards,
        euint64 rewardPerUser,
        bool isActive,
        uint256 endTime
    ) {
        require(_airdropId < airdropCount, "Invalid airdrop ID");
        AirdropConfig storage airdrop = airdrops[_airdropId];
        
        return (
            airdrop.airdropper,
            address(airdrop.rewardToken),
            airdrop.totalRewards,
            airdrop.remainingRewards,
            airdrop.rewardPerUser,
            airdrop.isActive,
            airdrop.endTime
        );
    }

    function getUserClaimInfo(uint256 _airdropId, address _user) external view returns (
        bool hasClaimed,
        euint64 claimedAmount,
        uint256 claimTime
    ) {
        require(_airdropId < airdropCount, "Invalid airdrop ID");
        UserClaim storage claim = userClaims[_airdropId][_user];
        
        return (claim.hasClaimed, claim.claimedAmount, claim.claimTime);
    }
}