import { network, ethers } from "hardhat"
import { networksConfig, sendValues, verify } from "../helper"
import type { Contract } from "@ethersproject/contracts"
import "dotenv/config"

const networkConfigHelper = networksConfig[network.name]

async function main() {
  const signers = await ethers.getSigners()
  const deployer = signers[0]
  console.log("Network:", network.name)
  console.log("Deployer:", deployer.address)
  if (network.name === "localhost") {
    await sendValues(signers.map((signer) => signer.address))
  }
  console.log("Deployer balance:", ethers.utils.formatEther(await deployer.getBalance()).toString())

  const spellsParams = {
    mintPrice: ethers.utils.parseEther("0.01"),
    baseUri: "https://example.com/metadata/spells/",
  }
  const spells = await deployContract("Spells", Object.values(spellsParams))

  const votesParams = {
    spells: spells.address,
    alpha: ethers.utils.parseEther("0.0099"),
    beta: ethers.utils.parseEther("0.001"),
    delta: ethers.utils.parseEther("0.0001"),
    uri: "https://example.com/metadata/votes/{id}",
  }
  const votes = await deployContract("Votes", Object.values(votesParams))
}

async function deployContract(name: string, params: any[]): Promise<Contract> {
  console.log(`Deploying contract "${name}"...`)
  const factory = await ethers.getContractFactory(name)
  const contract = await factory.deploy(...params)
  await contract.deployed()
  await contract.deployTransaction.wait(networkConfigHelper?.confirmations || 1)
  console.log(`Contract "${name}" deployed to ${contract.address}`)
  if (networkConfigHelper?.verify) {
    await verify(contract.address, params)
  }
  return contract
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
