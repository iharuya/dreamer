import { z } from "zod"

export const patchSchema = z.object({
  name: z.string().max(20, "20文字以下にしてください"),
}) // can be empty ""
export type PatchSchema = z.infer<typeof patchSchema>
