import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prismadb"
import { getToken } from "next-auth/jwt"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // create a new account
    const token = await getToken({ req })
    const address = (req.body.address as string) || undefined
    if (!token || token.sub !== address) {
      return res.status(401).json({ message: "unauthorized" })
    }

    let account = await prisma.account.findUnique({
      where: { address },
    })
    if (account) {
      return res.status(400).json({ message: "account already exists" })
    }
    account = await prisma.account.create({
      data: {
        address,
      },
    })
    return res.status(200).json(account)
  } else if (req.method === "GET") {
    const accounts = await prisma.account.findMany()
    return res.status(200).json(accounts)
  } else {
    return res.status(405).json({ message: "method not allowed" })
  }
}

export default handler
