import { z } from "zod"
import { ethAddress } from "@/lib/zod"

export const HeadAccount = z.object({
  query: z.object({
    address: ethAddress,
  }),
})

export const GetAccount = z.object({
  query: z.object({
    address: ethAddress,
  }),
})

export const UpdateAccount = z.object({
  query: z.object({ address: ethAddress }),
  body: z.object({
    name: z.string().max(20, "20文字以下にしてください"),
  }),
})

export const GetAccounts = z.object({})

export const CreateAccount = z.object({
  body: z.object({
    address: ethAddress,
  }),
})
