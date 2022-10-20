import { ethers } from "hardhat"
import { setup, deployContract } from "./utils"

async function main() {
  await setup()

  const dreamsParams = {
    alpha: ethers.utils.parseEther("0.0099"),
    beta: ethers.utils.parseEther("0.001"),
    delta: ethers.utils.parseEther("0.0001"),
    uri: "https://example.com/metadata/dreams/{id}",
  }
  await deployContract("Dreams", Object.values(dreamsParams))
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
