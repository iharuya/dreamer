import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prismadb"
import { getToken } from "next-auth/jwt"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const address = (req.query.address as string) || undefined // need a serializer...
  if (req.method === "HEAD") {
    const account = await prisma.account.findUnique({
      where: { address },
      select: { address: true },
    })
    if (account) res.status(200).end()
    res.status(404).end()
  } else if (req.method === "GET") {
    const account = await prisma.account.findUnique({
      where: { address },
    })
    if (!account) return res.status(404).json({ message: "account not found" })
    return res.status(200).json(account)
  } else if (req.method === "PATCH") {
    const token = await getToken({ req })
    if (!token || token.sub !== address) {
      // need to implement a middleware...
      return res.status(401).json({ message: "unauthorized" })
    }
    // need to implement a serializer and validation...
    const newName = (req.body.name as string) || undefined
    const updatedAccount = await prisma.account.update({
      where: { address },
      data: { name: newName },
    })
    return res.status(200).json(updatedAccount)
  } else {
    return res.status(405).json({ message: "method not allowed" })
  }
}

export default handler
