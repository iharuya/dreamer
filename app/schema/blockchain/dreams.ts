import { bigNumberString, ethAddress } from "@/lib/zod"
import { z } from "zod"

export const GetIsDreamMinted = z.object({
  query: z.object({
    ticketId: bigNumberString,
  }),
})

// Todo: remove this and calculate on the client side
export const GetMintValue = z.object({
  query: z.object({
    tokenId: bigNumberString,
  }),
})

export const GetTotalSupply = z.object({
  query: z.object({
    tokenId: bigNumberString,
  }),
})

export const GetBalanceOf = z.object({
  query: z.object({
    address: ethAddress,
    tokenId: bigNumberString,
  }),
})
