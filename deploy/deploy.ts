import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy ConfidentialCoin1
  const deployedCoin1 = await deploy("ConfidentialCoin1", {
    from: deployer,
    log: true,
  });
  console.log(`ConfidentialCoin1 contract: `, deployedCoin1.address);

  // Deploy ConfidentialCoin2
  const deployedCoin2 = await deploy("ConfidentialCoin2", {
    from: deployer,
    log: true,
  });
  console.log(`ConfidentialCoin2 contract: `, deployedCoin2.address);

  // Deploy TestToken
  const deployedTestToken = await deploy("TestToken", {
    from: deployer,
    args: ["Test Token", "TEST", 1000000], // name, symbol, initialSupply
    log: true,
  });
  console.log(`TestToken contract: `, deployedTestToken.address);

  // Deploy TestNFT
  const deployedTestNFT = await deploy("TestNFT", {
    from: deployer,
    args: ["Test NFT", "TNFT"], // name, symbol
    log: true,
  });
  console.log(`TestNFT contract: `, deployedTestNFT.address);

  // Deploy InvisibleDrop (main contract)
  const deployedInvisibleDrop = await deploy("InvisibleDrop", {
    from: deployer,
    args: [], // No constructor arguments needed
    log: true,
  });
  console.log(`InvisibleDrop contract: `, deployedInvisibleDrop.address);
};
export default func;
func.id = "deploy_all_contracts"; // id required to prevent reexecution
func.tags = ["All"];
