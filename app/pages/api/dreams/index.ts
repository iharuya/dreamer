import prisma from "@/lib/prisma"
import { NextApiHandler } from "next"
import { withZod } from "@/lib/zod"
import { GetPublishedDreams } from "@/schema/dreams"
import { Account, Dream, DreamImage, DreamTicket } from "@prisma/client"

const handleGet = withZod(GetPublishedDreams, async (req, res) => {
  let dreams
  if (req.query.dreamerAddress) {
    dreams = await prisma.dream.findMany({
      where: {
        status: "PUBLISHED",
        dreamerAddress: req.query.dreamerAddress,
      },
      include: { image: true, ticket: true, dreamer: true },
      orderBy: [{ publishedAt: "desc" }],
    })
  } else {
    dreams = await prisma.dream.findMany({
      where: { status: "PUBLISHED" },
      include: { image: true, ticket: true, dreamer: true },
      orderBy: [{ publishedAt: "desc" }],
    })
  }
  return res.status(200).json(dreams)
})
export type Get = (Dream & {
  status: "PUBLISHED"
  image: DreamImage
  ticket: DreamTicket
  dreamer: Account
})[]

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGet(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
