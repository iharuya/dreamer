import prisma from "@/lib/prisma"
import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"
import { withZod } from "@/lib/zod"
import { getMany, post } from "@/schema/accounts"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"

const handleGet = withZod(getMany, async (req, res) => {
  const accounts = await prisma.account.findMany()
  return res.status(200).json(accounts)
})

const handlePost = withZod(post, async (req, res) => {
  const token = await getToken({ req })
  const address = req.body.address
  if (!token || token.sub !== address) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  try {
    const account = await prisma.account.create({
      data: {
        address,
      },
    })
    return res.status(201).json(account)
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      return res.status(400).json({ message: "Account already exists" })
    }
    throw err
  }
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
