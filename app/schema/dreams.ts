import { z } from "zod"
import { ethAddress } from "@/lib/zod"

// Todo: Starts with capital case

// Draft
export const getDraftDreams = z.object({
  query: z.object({
    dreamerAddress: ethAddress,
  }),
})
export const createDraft = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, { message: "タイトルを入力してください" })
      .max(40, { message: "40文字以下にしてください" }),
    caption: z.string().max(1000, {message: "1000文字以下にしてください"}).optional(),
    prompt: z
      .string()
      .min(1, { message: "プロンプトを入力してください" })
      .max(400, { message: "400文字以下にしてください" }),
    dreamerAddress: ethAddress,
    parentId: z.number().int().optional(),
  }),
})
export const updateDraft = z.object({
  query: z.object({
    id: z.number().int(),
  }),
  body: z.object({
    title: createDraft.shape.body.shape.title,
    caption: createDraft.shape.body.shape.caption,
    prompt: createDraft.shape.body.shape.prompt,
  }),
})
export const deleteDraft = z.object({
  query: z.object({
    id: z.number().int(),
  }),
})

// Ticket
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

// Image
export const generateImage = z.object({
  body: z.object({
    dreamId: z.number().int(),
  }),
})

// Published
export const getPublishedDreams = z.object({
  query: z.object({
    dreamerAddress: ethAddress.optional(),
  }),
})
