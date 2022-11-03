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

export const isDreamMinted = async (ticketId: string): Promise<boolean> => {
  const logs = await alchemy.core.getLogs({
    address: ADDRESS,
    // Should use blockhash in order not to get all events
    fromBlock: decimalToHexWithPrefix(MINED_BLOCK),
    toBlock: "latest",
    topics: [TOPIC_MINTED],
  })

  const mintedLog = logs.find((log) => {
    const ticketIdHex = log.topics[3]
    const decimalString = ethers.BigNumber.from(ticketIdHex).toString()
    return decimalString === ticketId
  })
  return mintedLog !== undefined ? true : false
}

export const getMintValue = async (tokenId: string) => {
  const raw = await dreams.mintValue(tokenId)
  return raw.toString()
}

export const getTotalSupply = async (tokenId: string) => {
  const raw = await dreams.totalSupply(tokenId)
  return raw.toNumber()
}

export const getBalanceOf = async (address: string, tokenId: string) => {
  const raw = await dreams.balanceOf(address, tokenId)
  return raw.toNumber()
}

export const signToMintDream = async (
  ticketId: string,
  senderAddress: string,
  tokenId: string,
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
