import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * Tutorial: Deploy and Interact with InvisibleDrop Contract
 * ========================================================
 *
 * 1. Deploy contracts:
 *    npx hardhat task:deploy-all
 *
 * 2. Create airdrop:
 *    npx hardhat task:airdrop:create --token <TOKEN_ADDRESS> --amount 1000 --duration 24
 *
 * 3. Deposit tokens to airdrop:
 *    npx hardhat task:airdrop:deposit --id 0 --amount 10000
 *
 * 4. Check eligibility:
 *    npx hardhat task:airdrop:check --id 0
 *
 * 5. Claim airdrop:
 *    npx hardhat task:airdrop:claim --id 0
 *
 * 6. Mint confidential coins:
 *    npx hardhat task:coin:mint --contract <COIN_ADDRESS> --amount 1000
 */

/**
 * Deploy all contracts
 */
task("task:deploy-all", "Deploy all contracts").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { ethers } = hre;
  console.log("Deploying all contracts...");

  // Deploy test tokens first
  const TestToken = await ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy("Test Token", "TST", 18);
  await testToken.deployed();
  console.log("TestToken deployed to:", testToken.address);

  const TestNFT = await ethers.getContractFactory("TestNFT");
  const testNFT = await TestNFT.deploy("Test NFT", "TNFT");
  await testNFT.deployed();
  console.log("TestNFT deployed to:", testNFT.address);

  // Deploy confidential coins
  const ConfidentialCoin1 = await ethers.getContractFactory("ConfidentialCoin1");
  const coin1 = await ConfidentialCoin1.deploy("Confidential Coin 1", "CC1", 18);
  await coin1.deployed();
  console.log("ConfidentialCoin1 deployed to:", coin1.address);

  const ConfidentialCoin2 = await ethers.getContractFactory("ConfidentialCoin2");
  const coin2 = await ConfidentialCoin2.deploy("Confidential Coin 2", "CC2", 18);
  await coin2.deployed();
  console.log("ConfidentialCoin2 deployed to:", coin2.address);

  // Deploy main airdrop contract
  const InvisibleDrop = await ethers.getContractFactory("InvisibleDrop");
  const invisibleDrop = await InvisibleDrop.deploy();
  await invisibleDrop.deployed();
  console.log("InvisibleDrop deployed to:", invisibleDrop.address);

  return {
    testToken: testToken.address,
    testNFT: testNFT.address,
    coin1: coin1.address,
    coin2: coin2.address,
    invisibleDrop: invisibleDrop.address
  };
});

/**
 * Create a new airdrop
 */
task("task:airdrop:create", "Create a new airdrop")
  .addParam("contract", "InvisibleDrop contract address")
  .addParam("token", "Reward token address")
  .addParam("amount", "Reward amount per user")
  .addParam("duration", "Duration in hours", "24")
  .addOptionalParam("nft", "Required NFT contract address")
  .addOptionalParam("tokenreq", "Required token contract address")
  .addOptionalParam("minamount", "Minimum token amount", "0")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers } = hre;

    const amount = parseInt(taskArguments.amount);
    if (!Number.isInteger(amount)) {
      throw new Error(`Argument --amount is not an integer`);
    }

    const signers = await ethers.getSigners();
    const invisibleDrop = await ethers.getContractAt("InvisibleDrop", taskArguments.contract);

    const endTime = Math.floor(Date.now() / 1000) + (parseInt(taskArguments.duration) * 3600);

    const tx = await invisibleDrop.createAirdrop(
      taskArguments.token,
      amount, // 现在是普通的uint256，不需要加密
      endTime,
      !!taskArguments.nft,
      taskArguments.nft || ethers.constants.AddressZero,
      !!taskArguments.tokenreq,
      taskArguments.tokenreq || ethers.constants.AddressZero,
      taskArguments.minamount || "0"
    );

    console.log(`Wait for tx:${tx.hash}...`);
    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === "AirdropCreated");
    const airdropId = event?.args?.airdropId;

    console.log(`tx:${tx.hash} status=${receipt?.status}`);
    console.log("Airdrop created with ID:", airdropId.toString());
    return airdropId.toString();
  });

/**
 * Deposit tokens to airdrop contract
 */
task("task:airdrop:deposit", "Deposit tokens to airdrop contract")
  .addParam("contract", "InvisibleDrop contract address")
  .addParam("id", "Airdrop ID")
  .addParam("amount", "Amount to deposit")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, fhevm } = hre;

    const amount = parseInt(taskArguments.amount);
    if (!Number.isInteger(amount)) {
      throw new Error(`Argument --amount is not an integer`);
    }

    await fhevm.initializeCLIApi();

    const signers = await ethers.getSigners();
    const invisibleDrop = await ethers.getContractAt("InvisibleDrop", taskArguments.contract);

    // Encrypt the deposit amount
    const encryptedInput = await fhevm
      .createEncryptedInput(taskArguments.contract, signers[0].address)
      .add64(amount)
      .encrypt();

    const tx = await invisibleDrop.depositRewards(
      taskArguments.id,
      encryptedInput.handles[0],
      encryptedInput.inputProof
    );

    console.log(`Wait for tx:${tx.hash}...`);
    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);
    console.log(`Deposit ${amount} tokens succeeded!`);
  });

/**
 * Check eligibility and claimable amount
 */
task("task:airdrop:check", "Check eligibility and claimable amount")
  .addParam("contract", "InvisibleDrop contract address")
  .addParam("id", "Airdrop ID")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const signers = await ethers.getSigners();
    const invisibleDrop = await ethers.getContractAt("InvisibleDrop", taskArguments.contract);

    const eligible = await invisibleDrop.checkEligibility(taskArguments.id, signers[0].address);
    console.log("Eligible for airdrop:", eligible);

    if (eligible) {
      const claimableAmount = await invisibleDrop.checkClaimableAmount(taskArguments.id, signers[0].address);
      console.log(`Claimable amount: ${claimableAmount.toString()}`);
    }
  });

/**
 * Claim airdrop tokens
 */
task("task:airdrop:claim", "Claim airdrop tokens")
  .addParam("contract", "InvisibleDrop contract address")
  .addParam("id", "Airdrop ID")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers } = hre;

    const signers = await ethers.getSigners();
    const invisibleDrop = await ethers.getContractAt("InvisibleDrop", taskArguments.contract);

    const eligible = await invisibleDrop.checkEligibility(taskArguments.id, signers[0].address);
    console.log("Eligible for airdrop:", eligible);

    if (eligible) {
      const tx = await invisibleDrop.claimReward(taskArguments.id);

      console.log(`Wait for tx:${tx.hash}...`);
      const receipt = await tx.wait();
      console.log(`tx:${tx.hash} status=${receipt?.status}`);
      console.log(`Airdrop claim succeeded!`);
    } else {
      console.log("Not eligible for this airdrop");
    }
  });

/**
 * Get airdrop information
 */
task("task:airdrop:info", "Get airdrop information")
  .addParam("contract", "InvisibleDrop contract address")
  .addParam("id", "Airdrop ID")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers } = hre;

    const invisibleDrop = await ethers.getContractAt("InvisibleDrop", taskArguments.contract);

    const info = await invisibleDrop.getAirdropInfo(taskArguments.id);
    const conditions = await invisibleDrop.getAirdropConditions(taskArguments.id);

    console.log("Airdrop Information:");
    console.log("- Airdropper:", info.airdropper);
    console.log("- Reward Token:", info.rewardToken);
    console.log("- Active:", info.isActive);
    console.log("- End Time:", new Date(info.endTime.toNumber() * 1000).toISOString());
    console.log("- Requires NFT:", conditions.requireNFT);
    if (conditions.requireNFT) {
      console.log("- NFT Contract:", conditions.nftContract);
    }
    console.log("- Requires Token:", conditions.requireToken);
    if (conditions.requireToken) {
      console.log("- Token Contract:", conditions.tokenContract);
      console.log("- Min Amount:", conditions.minTokenAmount.toString());
    }
  });

/**
 * Mint confidential coins
 */
task("task:coin:mint", "Mint confidential coins")
  .addParam("contract", "Coin contract address")
  .addParam("amount", "Amount to mint")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, fhevm } = hre;

    const amount = parseInt(taskArguments.amount);
    if (!Number.isInteger(amount)) {
      throw new Error(`Argument --amount is not an integer`);
    }

    await fhevm.initializeCLIApi();

    const signers = await ethers.getSigners();
    const coin = await ethers.getContractAt("ConfidentialCoin1", taskArguments.contract);

    // Create encrypted input for mint amount
    const encryptedInput = await fhevm
      .createEncryptedInput(taskArguments.contract, signers[0].address)
      .add64(amount)
      .encrypt();

    const tx = await coin.mint(encryptedInput.handles[0], encryptedInput.inputProof);

    console.log(`Wait for tx:${tx.hash}...`);
    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);
    console.log("Coins minted successfully");
  });