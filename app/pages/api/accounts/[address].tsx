import prisma from "@/lib/prisma"
import { getToken } from "next-auth/jwt"
import { NextApiHandler } from "next"
import { z } from "zod"
import { withZod, zodAddress } from "@/lib/zod"
import { patchSchema } from "schema/account"
import { sleep } from "@/lib/utils"

const handleGet = withZod(
  z.object({
    query: z.object({
      address: zodAddress,
    }),
  }),
  async (req, res) => {
    const address = req.query.address
    const account = await prisma.account.findUnique({
      where: { address },
    })
    if (!account) return res.status(404).json({ message: "account not found" })
    return res.status(200).json(account)
  }
)

const handlePatch = withZod(
  z.object({
    query: z.object({ address: zodAddress }),
    body: patchSchema,
  }),
  async (req, res) => {
    const address = req.query.address
    const token = await getToken({ req })
    if (!token || token.sub !== address) {
      return res.status(401).json({ message: "unauthorized" })
    }
    const updatedAccount = await prisma.account.update({
      where: { address },
      data: { name: req.body.name },
    })
    return res.status(200).json(updatedAccount)
  }
)

const handleHead = withZod(
  z.object({
    query: z.object({ address: zodAddress }),
  }),
  async (req, res) => {
    const address = req.query.address
    const account = await prisma.account.findUnique({
      where: { address },
    })
    if (account) return res.status(200).end()
    return res.status(404).end()
  }
)

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "HEAD":
      return handleHead(req, res)
    case "GET":
      console.log("get called")
      await sleep(3000)
      return handleGet(req, res)
    case "PATCH":
      return handlePatch(req, res)
    default:
      return res.status(405).json({ message: "method not allowed" })
  }
}

export default handler
