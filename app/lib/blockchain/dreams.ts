import { ethers } from "ethers"
import { alchemy, provider } from "@/lib/alchemy"
import {
  ADDRESS,
  MINED_BLOCK,
  TOPIC_MINTED,
} from "@/constants/contracts/dreams"
import ABI from "@/constants/contracts/abi/Dreams.json"
import { Dreams } from "@/types/contracts/Dreams"
import { decimalToHexWithPrefix } from "../utils"

const dreams = new ethers.Contract(ADDRESS, ABI, provider) as Dreams

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

export const getMintValue = async (tokenId: number): Promise<string> => {
  const raw = await dreams.mintValue(tokenId)
  return raw.toString()
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
