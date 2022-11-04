import prisma from "@/lib/prisma"
import { withZod } from "@/lib/zod"
import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"
import { GetDraft, UpdateDraft, DeleteDraft } from "@/schema/dreams"
import { Account, Dream, DreamImage } from "@prisma/client"

const handleGet = withZod(GetDraft, async (req, res) => {
  const token = await getToken({ req })
  const draft = await prisma.dream.findFirst({
    where: { id: req.query.id, status: "DRAFT" },
    include: {
      parent: {
        include: {
          image: true,
          dreamer: true,
        },
      },
    },
  })
  if (!draft) {
    return res.status(404).json({ message: "Draft not found" })
  }
  // Draft can only be seen by its author
  if (!token || token.sub !== draft.dreamerAddress) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  return res.status(200).json(draft)
})
export type Get = Dream & {
  parent?: Dream & {
    status: "PUBLISHED"
    image: DreamImage
    dreamer: Account
  }
}

const handleUpdate = withZod(UpdateDraft, async (req, res) => {
  const token = await getToken({ req })
  const draft = await prisma.dream.findFirst({
    where: { id: req.query.id, status: "DRAFT" },
  })
  if (!draft) {
    return res.status(404).json({ message: "Draft not found" })
  }
  if (!token || token.sub !== draft.dreamerAddress) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const newDraft = await prisma.dream.update({
    where: { id: req.query.id },
    data: {
      title: req.body.title,
      caption: req.body.caption,
      prompt: req.body.prompt,
    },
  })
  return res.status(200).json(newDraft)
})
export type Patch = Dream

const handleDelete = withZod(DeleteDraft, async (req, res) => {
  const token = await getToken({ req })
  const draft = await prisma.dream.findFirst({
    where: { id: req.query.id, status: "DRAFT" },
  })
  if (!draft) {
    return res.status(404).json({ message: "Draft not found" })
  }
  if (!token || token.sub !== draft.dreamerAddress) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  await prisma.dream.delete({ where: { id: req.query.id } })
  return res.status(200).json({ message: "Deleted" })
})

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGet(req, res)
    case "PATCH":
      return handleUpdate(req, res)
    case "DELETE":
      return handleDelete(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
