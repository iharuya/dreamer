import { z } from "zod"
import { ethAddress } from "@/lib/zod"

export const getMany = z.object({
  query: z.object({
    dreamer: ethAddress.optional(),
  }),
})
export const createDraft = z.object({
  body: z.object({
    body: z
      .string()
      .min(1, { message: "内容を入力してください" })
      .max(240, { message: "240文字以下にしてください" }),
    prompt: z
      .string()
      .min(1, { message: "内容を入力してください" })
      .max(400, { message: "400文字以下にしてください" }),
    dreamer: ethAddress,
    parentId: z.number().int().optional(),
  }),
})

export const generateImage = z.object({
  body: z.object({
    dreamId: z.number().int(),
  }),
})

export const issueTicket = z.object({
  body: z.object({
    senderAddress: ethAddress,
    dreamId: z.number().int(),
  }),
})
export const updateTicket = z.object({
  query: z.object({
    id: z.number().int(),
  }),
})
export const deleteTicket = z.object({
  query: z.object({
    id: z.number().int(),
  }),
})
