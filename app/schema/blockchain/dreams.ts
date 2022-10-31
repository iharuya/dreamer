import { z } from "zod"

export const GetIsDreamMinted = z.object({
  query: z.object({
    ticketId: z.string().regex(/^\d+$/).transform(Number),
  }),
})

export const GetMintValue = z.object({
  query: z.object({
    tokenId: z.string().regex(/^\d+$/).transform(Number),
  }),
})
