import { ethers } from "ethers"
import { Alchemy, Network } from "alchemy-sdk"

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_APIKEY_MUMBAI,
  network: Network.MATIC_MUMBAI,
})

/* eslint-disable */
export const getBlockNumber = async () => {
  return alchemy.core.getBlockNumber()
}

export const isDreamMinted = async (ticketId: number): Promise<boolean> => {
  // ad hoc
  const events = await Promise.resolve([
    {
      to: "0x",
      tokenId: "123",
      ticketId: "246",
    },
  ])
  return events.length === 1
}

export const signToMintDream = async (
  ticketId: number,
  senderAddress: string,
  tokenId: number,
  expiresAt: number
): Promise<string> => {
  const wallet = new ethers.Wallet(process.env.APP_SIGNER_PRIVATE as string)
  const messageHash = ethers.utils.solidityKeccak256(
    ["uint256", "address", "uint256", "uint256"],
    [ticketId, senderAddress, tokenId, expiresAt]
  )
  const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash))
  return signature
}
