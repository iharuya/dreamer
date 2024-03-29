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
      url: `http://localhost:${process.env.PORT || "8545"}`,
      accounts: {
        mnemonic: process.env.DEV_MNEMONIC || "",
      },
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "",
      accounts: {
        mnemonic: process.env.DEV_MNEMONIC || "",
      },
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_APIKEY || "",
    },
  },
}

export default config
