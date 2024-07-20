const hre = require("hardhat");

async function main() {

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the contract
  const ArtChain = await hre.ethers.getContractFactory("ArtChain");
  const artChain = await ArtChain.deploy(); // No parameters needed

  await artChain.deployed();
  console.log("ArtChain deployed to:", artChain.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
