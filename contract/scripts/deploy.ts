import { ethers } from "hardhat"
import { setup, deployContract } from "./utils"
import "dotenv/config"

async function main() {
  await setup()
  const APP_SIGNER_ADDRESS = process.env.APP_SIGNER_ADDRESS
  if (!APP_SIGNER_ADDRESS)
    throw new Error("APP SIGNER ADDRESS env variable is missing")
  const dreamsParams = {
    alpha: ethers.utils.parseEther("0.0099"),
    beta: ethers.utils.parseEther("0.001"),
    delta: ethers.utils.parseEther("0.0001"),
    signer: APP_SIGNER_ADDRESS,
    uri: "https://example.com/metadata/dreams/{id}",
  }
  await deployContract("Dreams", Object.values(dreamsParams))
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
