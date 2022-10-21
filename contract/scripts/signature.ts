import { ethers } from "hardhat"
import "dotenv/config"
import type { Wallet } from "ethers"

async function main() {
  const APP_SIGNER_PRIVATE = process.env.APP_SIGNER_PRIVATE
  const APP_SIGNER_ADDRESS = process.env.APP_SIGNER_ADDRESS
  const signer = new ethers.Wallet(
    APP_SIGNER_PRIVATE as string,
    ethers.provider
  )
  if (signer.address !== APP_SIGNER_ADDRESS)
    throw new Error("wrong APP_SIGNER env variables")
  console.log(`Signer Address: ${signer.address}`)

  const sender = (await ethers.getSigners())[0]
  const signature = await generateSignatureForMint(signer, [
    {name: "requestId", type: "uint256", value: 12345},
    {name: "sender", type: "address", value: sender.address},
    {name: "tokenId", type: "uint256", value: 0},
    {name: "expires", type: "uint256", value: 10000000},
  ])
  console.log(`Signature: ${signature}`)
}

type CommonSolidityType = "uint256" | "string" | "address" | "bytes" | "bytes32"
async function generateSignatureForMint(
  signer: Wallet,
  inputs: {name: string, type: CommonSolidityType, value: any}[]
) {
  const messageHash = ethers.utils.solidityKeccak256(
    inputs.map((input) => input.type),
    inputs.map((input) => input.value),
  )
  const signature = await signer.signMessage(ethers.utils.arrayify(messageHash))
  return signature
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
