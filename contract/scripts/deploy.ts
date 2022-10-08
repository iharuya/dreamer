import { network, ethers } from "hardhat"
import { networksConfig, sendValues, verify } from "../helper"
require("dotenv").config()

async function main() {
  const signers = await ethers.getSigners()
  const deployer = signers[0]
  const networkConfigHelper = networksConfig[network.name]
  console.log("Network:", network.name)
  console.log("Deployer:", deployer.address)

  if (network.name === "localhost") {
    await sendValues(signers.map((signer) => signer.address))
  }
  console.log("Deployer balance:", ethers.utils.formatEther(await deployer.getBalance()).toString())

  const factory = await ethers.getContractFactory("Spells")
  const mintPrice = ethers.utils.parseEther("0.01")
  const params = [mintPrice]
  const contract = await factory.deploy(...params)
  await contract.deployed()
  await contract.deployTransaction.wait(networkConfigHelper?.confirmations || 1)
  console.log("Contract deployed to:", contract.address)

  if (networkConfigHelper?.verify) {
    await verify(contract.address, params)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
