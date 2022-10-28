import prisma from "@/lib/prisma"
import { NextApiHandler } from "next"
import { withZod } from "@/lib/zod"
import { getPublishedDreams } from "@/schema/dreams"

const handleGet = withZod(getPublishedDreams, async (req, res) => {
  let dreams
  if (req.query.dreamerAddress) {
    dreams = await prisma.dream.findMany({
      where: {
        status: "PUBLISHED",
        dreamerAddress: req.query.dreamerAddress,
      },
      orderBy: [{ publishedAt: "desc" }],
    })
  } else {
    dreams = await prisma.dream.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }],
    })
  }
  return res.status(200).json(dreams)
})

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGet(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
