import { run, ethers } from "hardhat"
import "dotenv/config"

interface NetworkConfig {
  confirmations?: number
  verify?: boolean
}
interface NetworksConfig {
  [networkName: string]: NetworkConfig | undefined
}
export const networksConfig: NetworksConfig = {
  goerli: {
    confirmations: 6,
    verify: process.env.ETHERSCAN_APIKEY ? true : false,
  },
  mumbai: {
    confirmations: 6,
    verify: process.env.POLYGONSCAN_APIKEY ? true : false,
  },
}

export async function sendValues(addresses: string[]) {
  let sender = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  )
  sender = sender.connect(ethers.provider)
  const sendAmount = ethers.utils.parseEther("1")
  for (const address of addresses) {
    const tx = { to: address, value: sendAmount }
    await sender.sendTransaction(tx)
  }
}

export async function verify(address: string, args: any[]) {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: args,
    })
    console.log("Verified")
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already verified")
    } else {
      console.error(error)
    }
  }
}
