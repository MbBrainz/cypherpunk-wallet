import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import type { Contract } from "ethers";
import type { ERC6538Registry } from "../typechain-types";

const STEALH_META_ADDRESS =
  "0x027e6d20597461aa9af2570e276c3c4ecb6de0bfd35c3cd0bb4c5cfd220932d49e03e109f66f1f53c58766c643fe95baff4b9f2c187b2708ca41f357128a03265a04";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy ERC5564Announcer
  await deploy("ERC5564Announcer", {
    from: deployer,
    args: [], // No constructor arguments needed
    log: true,
    autoMine: true,
  });

  // Deploy ERC6538Registry
  await deploy("ERC6538Registry", {
    from: deployer,
    args: [], // No constructor arguments needed
    log: true,
    autoMine: true,
  });

  const announcerContract = await hre.ethers.getContract<Contract>("ERC5564Announcer");
  const announcerAddress = await announcerContract.getAddress();

  // registry address
  const registryContract = await hre.ethers.getContract<ERC6538Registry>("ERC6538Registry");
  const registryAddress = await registryContract.getAddress();


  console.log(`Registering keys for ${STEALH_META_ADDRESS} for ${deployer} on ${registryAddress}`);
  await registryContract.registerKeys(1, STEALH_META_ADDRESS);

  // Deploy Stealthereum with the announcer address
  await deploy("Stealthereum", {
    from: deployer,
    args: [announcerAddress],
    log: true,
    autoMine: true,
  });

  // stealthereum address
  const stealthereumContract = await hre.ethers.getContract<Contract>("Stealthereum");
  const stealthereumAddress = await stealthereumContract.getAddress();

  await deploy("StealthSwapHelper", {
    from: deployer,
    args: [stealthereumAddress], // Use the deployed stealthereum address
    log: true,
    autoMine: true,
  });
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
