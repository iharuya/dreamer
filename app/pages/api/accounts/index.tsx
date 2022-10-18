import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prismadb"
import { isAddress } from "ethers/lib/utils"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // 誰でもアカウントのレコードは作成できる
    const address = JSON.parse(req.body).address
    if (!(typeof address === "string" && isAddress(address))) {
      return res.status(400).json({ message: "invalid address" })
    }
    let account = await prisma.account.findUnique({
      where: { address },
    })
    if (account)
      return res.status(400).json({ message: "account already exists" })
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
