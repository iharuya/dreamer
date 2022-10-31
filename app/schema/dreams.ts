import { z } from "zod"
import { ethAddress } from "@/lib/zod"

// Draft
export const GetDrafts = z.object({
  query: z.object({
    dreamerAddress: ethAddress,
  }),
})
export const GetDraft = z.object({
  query: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
})
export const CreateDraft = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, { message: "タイトルを入力してください" })
      .max(40, { message: "40文字以下にしてください" }),
    caption: z
      .string()
      .max(1000, { message: "1000文字以下にしてください" })
      .optional(),
    prompt: z
      .string()
      .min(1, { message: "プロンプトを入力してください" })
      .max(400, { message: "400文字以下にしてください" }),
    dreamerAddress: ethAddress,
    parentId: z.number().int().optional(),
  }),
})
export const UpdateDraft = z.object({
  query: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    title: CreateDraft.shape.body.shape.title,
    caption: CreateDraft.shape.body.shape.caption,
    prompt: CreateDraft.shape.body.shape.prompt,
  }),
})
export const DeleteDraft = z.object({
  query: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
})

// Ticket
export const GetTickets = z.object({
  query: z.object({
    senderAddress: ethAddress,
  }),
})
export const GetTicket = z.object({
  query: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
})

export const IssueTicket = z.object({
  body: z.object({
    senderAddress: ethAddress,
    dreamId: z.number().int(),
  }),
})
export const UpdateTicket = z.object({
  query: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
})
export const DeleteTicket = z.object({
  query: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
})

// Image
export const GenerateImage = z.object({
  body: z.object({
    dreamId: z.number().int(),
  }),
})

// Published
export const GetPublishedDreams = z.object({
  query: z.object({
    dreamerAddress: ethAddress.optional(),
  }),
})
