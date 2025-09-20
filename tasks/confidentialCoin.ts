import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("mint-coin1", "Mint ConfidentialCoin1 tokens")
  .addParam("to", "The address to mint tokens to")
  .addParam("amount", "The amount to mint (in wei)")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { to, amount } = taskArgs;
    await hre.fhevm.initializeCLIApi();

    // Get the deployed contract
    const coin1Address = "0x36De2Ed8465ad8976D2D2be399aeF29f612b3d9E";
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
    await hre.fhevm.initializeCLIApi();

    // Get the deployed contract
    const coin2Address = "0xC50E8c96a2e6a11BA7F27B541617981B66256071";
    const ConfidentialCoin2 = await hre.ethers.getContractFactory("ConfidentialCoin2");
    const coin2 = ConfidentialCoin2.attach(coin2Address);

    console.log(`Minting ${amount} ConfidentialCoin2 tokens to ${to}...`);

    const tx = await coin2.mint(to, amount);
    await tx.wait();

    console.log(`✅ Minted ${amount} ConfidentialCoin2 tokens to ${to}`);
    console.log(`Transaction hash: ${tx.hash}`);
  });

task("set-operator-coin1", "Set InvisibleDrop as operator for ConfidentialCoin1")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    await hre.fhevm.initializeCLIApi();

    const coin1Address = "0x36De2Ed8465ad8976D2D2be399aeF29f612b3d9E";
    const invisibleDropAddress = "0x9BC6b95CcE52809B200C5355F8FE4B235751ae72";
    const ConfidentialCoin1 = await hre.ethers.getContractFactory("ConfidentialCoin1");
    const coin1 = ConfidentialCoin1.attach(coin1Address);

    const [signer] = await hre.ethers.getSigners();
    console.log(`Setting InvisibleDrop as operator for ConfidentialCoin1 from ${signer.address}...`);

    // Set operator until far in the future (timestamp)
    const futureTimestamp = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60); // 1 year from now

    const tx = await coin1.setOperator(invisibleDropAddress, futureTimestamp);
    await tx.wait();

    console.log(`✅ Set InvisibleDrop as operator for ConfidentialCoin1`);
    console.log(`Transaction hash: ${tx.hash}`);
  });

task("transfer-coin1", "Transfer ConfidentialCoin1 to address")
  .addParam("to", "The address to transfer to")
  .addParam("amount", "The amount to transfer")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { to, amount } = taskArgs;
    await hre.fhevm.initializeCLIApi();

    const coin1Address = "0x36De2Ed8465ad8976D2D2be399aeF29f612b3d9E";
    const ConfidentialCoin1 = await hre.ethers.getContractFactory("ConfidentialCoin1");
    const coin1 = ConfidentialCoin1.attach(coin1Address);

    const [signer] = await hre.ethers.getSigners();
    console.log(`Transferring ${amount} ConfidentialCoin1 to ${to} from ${signer.address}...`);

    // Create encrypted input for transfer
    const input = hre.fhevm.createEncryptedInput(coin1Address, signer.address);
    input.add64(BigInt(amount));
    const encryptedInput = await input.encrypt();

    const tx = await coin1["confidentialTransfer(address,bytes32,bytes)"](
      to,
      encryptedInput.handles[0],
      encryptedInput.inputProof
    );
    await tx.wait();

    console.log(`✅ Transferred ${amount} ConfidentialCoin1 to ${to}`);
    console.log(`Transaction hash: ${tx.hash}`);
  });

task("coin-info", "Get information about deployed ConfidentialCoin contracts")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const coin1Address = "0x36De2Ed8465ad8976D2D2be399aeF29f612b3d9E";
    const coin2Address = "0xC50E8c96a2e6a11BA7F27B541617981B66256071";

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