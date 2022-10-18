import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prismadb"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const address = req.query.address as string
  // not need to serialize?

  if (req.method === "GET") {
    const account = await prisma.account.findUnique({
      where: { address },
    })
    if (!account) return res.status(404).json({ message: "account not found" })
    return res.status(200).json(account)
  } else if (req.method === "PATCH") {
    // will do
  } else {
    return res.status(405).json({ message: "method not allowed" })
  }
}

export default handler
