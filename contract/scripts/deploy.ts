import { ethers } from "hardhat"
import { setup, deployContract } from "./utils"
import type { Prompts } from "../typechain-types/contracts/Prompts"

async function main() {
  await setup()

  const promptsParams = {
    mintPrice: ethers.utils.parseEther("0.01"),
    baseUri: "https://example.com/metadata/prompts/",
  }
  const prompts = (await deployContract(
    "Prompts",
    Object.values(promptsParams)
  )) as Prompts

  const votesParams = {
    prompts: prompts.address,
    alpha: ethers.utils.parseEther("0.0099"),
    beta: ethers.utils.parseEther("0.001"),
    delta: ethers.utils.parseEther("0.0001"),
    uri: "https://example.com/metadata/votes/{id}",
  }
  await deployContract("Votes", Object.values(votesParams))
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
