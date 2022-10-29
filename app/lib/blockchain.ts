import { ethers } from "ethers"

/* eslint-disable */
export const getBlockNumber = async () => {
  // ad hoc
  return await Promise.resolve(40000000)
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
