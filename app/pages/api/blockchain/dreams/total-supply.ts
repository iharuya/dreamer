import { NextApiHandler } from "next"
import { withZod } from "@/lib/zod"
import { getTotalSupply } from "@/lib/blockchain/dreams"
import { GetTotalSupply } from "@/schema/blockchain/dreams"

const handleGet = withZod(GetTotalSupply, async (req, res) => {
  const value = await getTotalSupply(req.query.tokenId)
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
