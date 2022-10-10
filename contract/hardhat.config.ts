import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "dotenv/config"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: process.env.DEV_MNEMONIC as string,
      },
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: {
        mnemonic: process.env.DEV_MNEMONIC as string,
      },
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: {
        mnemonic: process.env.DEV_MNEMONIC as string,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_APIKEY,
  },
}

export default config
