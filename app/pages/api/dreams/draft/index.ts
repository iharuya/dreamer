import prisma from "@/lib/prisma"
import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"
import { withZod } from "@/lib/zod"
import { getDraftDreams, createDraft } from "@/schema/dreams"

const handleGet = withZod(getDraftDreams, async (req, res) => {
  const token = await getToken({ req })
  const address = req.query.dreamerAddress
  if (!token || token.sub !== address) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const drafts = await prisma.dream.findMany({
    where: {
      status: "DRAFT",
      dreamerAddress: address,
    },
  })
  return res.status(200).json(drafts)
})

const handlePost = withZod(createDraft, async (req, res) => {
  const token = await getToken({ req })
  const address = req.body.dreamerAddress
  if (!token || token.sub !== address) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  let draft
  if (req.body.parentId) {
    const parent = await prisma.dream.findUnique({
      where: { id: req.body.parentId },
    })
    if (!parent) {
      return res.status(404).json({ message: "Parent dream not found" })
    }
    draft = await prisma.dream.create({
      data: {
        body: req.body.body,
        prompt: req.body.prompt,
        dreamerAddress: address,
        parentId: parent.id,
        generation: parent.generation + 1,
      },
    })
  } else {
    draft = await prisma.dream.create({
      data: {
        body: req.body.body,
        prompt: req.body.prompt,
        dreamerAddress: address,
        generation: 0,
      },
    })
  }
  return res.status(200).json(draft)
})

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGet(req, res)
    case "POST":
      return handlePost(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
