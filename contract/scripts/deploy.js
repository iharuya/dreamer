const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")
require("dotenv").config()

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Network:", network.name)
  console.log("Deployer:", deployer.address)
  console.log("Deployer balance:", ethers.utils.formatEther(await deployer.getBalance()).toString())

  const factory = await ethers.getContractFactory("Spells")
  const params = []
  const contract = await factory.deploy(...params)
  await contract.deployed()
  await contract.deployTransaction.wait(network.config.confirmations || 1)
  console.log("Contract deployed to:", contract.address)

  if (network.name === "localhost") {
    // Send ETH to specified addresses
    const sender = (await ethers.getSigners())[0]
    const sendAmount = ethers.utils.parseEther("1")
    let devAddressNum = 1
    while (process.env[`DEV_ADDRESS_${devAddressNum}`]) {
      const receiverAddress = process.env[`DEV_ADDRESS_${devAddressNum}`]
      const tx = { to: receiverAddress, value: sendAmount }
      await sender.sendTransaction(tx)
      devAddressNum++
    }
  }

  if (network.config.verify) {
    await verify(contract.address, params)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
