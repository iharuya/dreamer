import prisma from "@/lib/prisma"
import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"
import { withZod } from "@/lib/zod"
import { getMany, post } from "@/schema/accounts"

const handleGet = withZod(getMany, async (req, res) => {
  const accounts = await prisma.account.findMany()
  return res.status(200).json(accounts)
})

const handlePost = withZod(post, async (req, res) => {
  const token = await getToken({ req })
  const address = req.body.address
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
  return res.status(201).json(account)
})

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGet(req, res)
    case "POST":
      return handlePost(req, res)
    default:
      return res.status(405).json({ message: "method not allowed" })
  }
}

export default handler
