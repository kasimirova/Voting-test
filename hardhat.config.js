require("@nomiclabs/hardhat-waffle");
require('solidity-coverage')
require('dotenv').config()
require("./tasks/index.js")
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  networks: {

    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: {
        mnemonic: process.env.MNEMONIK,
        count: 10
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}