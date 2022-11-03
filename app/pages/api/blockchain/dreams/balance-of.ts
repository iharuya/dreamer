import { NextApiHandler } from "next"
import { withZod } from "@/lib/zod"
import { getBalanceOf } from "@/lib/blockchain/dreams"
import { GetBalanceOf } from "@/schema/blockchain/dreams"

const handleGet = withZod(GetBalanceOf, async (req, res) => {
  const value = await getBalanceOf(req.query.address, req.query.tokenId)
  return res.status(200).json(value)
})
export type Get = number

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGet(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
