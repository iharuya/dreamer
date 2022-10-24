import { z } from "zod"
import { ethAddress } from "@/lib/zod"

export const head = z.object({
  query: z.object({
    address: ethAddress,
  }),
})

export const getOne = z.object({
  query: z.object({
    address: ethAddress,
  }),
})

export const patch = z.object({
  query: z.object({ address: ethAddress }),
  body: z.object({
    name: z.string().max(20, "20文字以下にしてください"),
  }),
})

export const getMany = z.object({})

export const post = z.object({
  body: z.object({
    address: ethAddress,
  }),
})
