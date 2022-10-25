import prisma from "@/lib/prisma"
import { getToken } from "next-auth/jwt"
import { NextApiHandler } from "next"
import { withZod } from "@/lib/zod"
import { getOne, head, patch } from "@/schema/accounts"

const handleGet = withZod(getOne, async (req, res) => {
  const address = req.query.address
  const account = await prisma.account.findUnique({
    where: { address },
  })
  if (!account) return res.status(404).json({ message: "Account not found" })
  return res.status(200).json(account)
})

const handlePatch = withZod(patch, async (req, res) => {
  const address = req.query.address
  const token = await getToken({ req })
  if (!token || token.sub !== address) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  // Assume the account exists...
  const updatedAccount = await prisma.account.update({
    where: { address },
    data: { name: req.body.name },
  })
  return res.status(200).json(updatedAccount)
})

const handleHead = withZod(head, async (req, res) => {
  const address = req.query.address
  const account = await prisma.account.findUnique({
    where: { address },
  })
  if (account) return res.status(200).end()
  return res.status(404).end()
})

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "HEAD":
      return handleHead(req, res)
    case "GET":
      return handleGet(req, res)
    case "PATCH":
      return handlePatch(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
