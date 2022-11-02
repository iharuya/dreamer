import { bigNumberString } from "@/lib/zod"
import { z } from "zod"

export const GetIsDreamMinted = z.object({
  query: z.object({
    ticketId: bigNumberString,
  }),
})

export const GetMintValue = z.object({
  query: z.object({
    tokenId: bigNumberString,
  }),
})
