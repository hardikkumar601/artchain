require("@nomiclabs/hardhat-ethers");
require("dotenv").config();


module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
    },
    celoMainnet: {
      url: process.env.CELO_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};