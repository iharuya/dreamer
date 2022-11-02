import prisma from "@/lib/prisma"
import { NextApiHandler } from "next"
import { withZod } from "@/lib/zod"
import { GetPublishedDream } from "@/schema/dreams"
import { Account, Dream, DreamImage, DreamTicket } from "@prisma/client"

const handleGet = withZod(GetPublishedDream, async (req, res) => {
  const dream = await prisma.dream.findUnique({
    where: { id: req.query.id },
    include: {
      image: true,
      ticket: true,
      dreamer: true,
      parent: { include: { image: true, dreamer: true } },
      children: { include: { image: true, dreamer: true } },
    },
  })
  if (!dream || dream.status !== "PUBLISHED") {
    return res.status(404).json({ message: "Dream not found" })
  }
  return res.status(200).json(dream)
})
export type Get = Dream & {
  status: "PUBLISHED"
  image: DreamImage
  ticket: DreamTicket
  dreamer: Account
  publishedAt: string
  parent?: Dream & {
    status: "PUBLISHED"
    image: DreamImage
    dreamer: Account
  }
  children: (Dream & {
    status: "PUBLISHED"
    image: DreamImage
    dreamer: Account
  })[]
}

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGet(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
