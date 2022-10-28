import prisma from "@/lib/prisma"
import { withZod } from "@/lib/zod"
import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"
import { updateDraft, deleteDraft } from "@/schema/dreams"

const handleUpdate = withZod(updateDraft, async (req, res) => {
  const token = await getToken({ req })
  const dream = await prisma.dream.findUnique({
    where: { id: req.query.id },
  })
  if (!dream) {
    return res.status(404).json({ message: "Draft not found" })
  }
  if (!token || token.sub !== dream.dreamerAddress) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  if (dream.status !== "DRAFT") {
    return res.status(400).json({ message: "Dream's status is not draft" })
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

const handleDelete = withZod(deleteDraft, async (req, res) => {
  const token = await getToken({ req })
  const dream = await prisma.dream.findUnique({
    where: { id: req.query.id },
  })
  if (!dream) {
    return res.status(404).json({ message: "Draft not found" })
  }
  if (!token || token.sub !== dream.dreamerAddress) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  if (dream.status !== "DRAFT") {
    return res.status(400).json({ message: "Dream's status is not draft" })
  }

  await prisma.dream.delete({ where: { id: req.query.id } })
  return res.status(200).json({ message: "Deleted" })
})

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "PATCH":
      return handleUpdate(req, res)
    case "DELETE":
      return handleDelete(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
