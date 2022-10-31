import { ethers } from "ethers"
import { Alchemy, Network } from "alchemy-sdk"
import {
  ADDRESS,
  MINED_BLOCK,
  TOPIC_MINTED,
} from "@/constants/contracts/dreams"
import { decimalToHexWithPrefix } from "./utils"

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_APIKEY_MUMBAI,
  network: Network.MATIC_MUMBAI,
})

export const getBlockNumber = async () => {
  return alchemy.core.getBlockNumber()
}

export const isDreamMinted = async (ticketId: number): Promise<boolean> => {
  const logs = await alchemy.core.getLogs({
    address: ADDRESS,
    // Should use blockhash in order not to get all events
    fromBlock: decimalToHexWithPrefix(MINED_BLOCK),
    toBlock: "latest",
    topics: [TOPIC_MINTED],
  })

  const mintedLog = logs.find((log) => {
    const ticketIdHex = log.topics[3]
    return parseInt(ticketIdHex, 16) === ticketId
  })
  return mintedLog !== undefined ? true : false
}

export const getMintValue = async (tokenId: number): Promise<number> => {
  
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
