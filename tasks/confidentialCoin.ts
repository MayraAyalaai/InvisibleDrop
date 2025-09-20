import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("mint-coin1", "Mint ConfidentialCoin1 tokens")
  .addParam("to", "The address to mint tokens to")
  .addParam("amount", "The amount to mint (in wei)")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { to, amount } = taskArgs;

    // Get the deployed contract
    const coin1Address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const ConfidentialCoin1 = await hre.ethers.getContractFactory("ConfidentialCoin1");
    const coin1 = ConfidentialCoin1.attach(coin1Address);

    console.log(`Minting ${amount} ConfidentialCoin1 tokens to ${to}...`);

    const tx = await coin1.mint(to, amount);
    await tx.wait();

    console.log(`✅ Minted ${amount} ConfidentialCoin1 tokens to ${to}`);
    console.log(`Transaction hash: ${tx.hash}`);
  });

task("mint-coin2", "Mint ConfidentialCoin2 tokens")
  .addParam("to", "The address to mint tokens to")
  .addParam("amount", "The amount to mint (in wei)")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { to, amount } = taskArgs;

    // Get the deployed contract
    const coin2Address = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    const ConfidentialCoin2 = await hre.ethers.getContractFactory("ConfidentialCoin2");
    const coin2 = ConfidentialCoin2.attach(coin2Address);

    console.log(`Minting ${amount} ConfidentialCoin2 tokens to ${to}...`);

    const tx = await coin2.mint(to, amount);
    await tx.wait();

    console.log(`✅ Minted ${amount} ConfidentialCoin2 tokens to ${to}`);
    console.log(`Transaction hash: ${tx.hash}`);
  });

task("coin-info", "Get information about deployed ConfidentialCoin contracts")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const coin1Address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const coin2Address = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

    const ConfidentialCoin1 = await hre.ethers.getContractFactory("ConfidentialCoin1");
    const ConfidentialCoin2 = await hre.ethers.getContractFactory("ConfidentialCoin2");

    const coin1 = ConfidentialCoin1.attach(coin1Address);
    const coin2 = ConfidentialCoin2.attach(coin2Address);

    console.log("📋 ConfidentialCoin Contract Information:");
    console.log(`ConfidentialCoin1 Address: ${coin1Address}`);
    console.log(`ConfidentialCoin1 Name: ${await coin1.name()}`);
    console.log(`ConfidentialCoin1 Symbol: ${await coin1.symbol()}`);

    console.log(`\nConfidentialCoin2 Address: ${coin2Address}`);
    console.log(`ConfidentialCoin2 Name: ${await coin2.name()}`);
    console.log(`ConfidentialCoin2 Symbol: ${await coin2.symbol()}`);
  });