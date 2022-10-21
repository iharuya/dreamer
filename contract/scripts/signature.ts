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
  const signature = await generateSignatureForMint(
    signer,
    sender.address,
    0,
    10,
    0
  )
  console.log(`Signature: ${signature}`)
}

async function generateSignatureForMint(
  signer: Wallet,
  sender: string,
  tokenId: number,
  amount: number,
  nonce: number
) {
  const messageHash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "uint256", "uint256"],
    [sender, tokenId, amount, nonce]
  )
  const signature = await signer.signMessage(ethers.utils.arrayify(messageHash))
  return signature
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
