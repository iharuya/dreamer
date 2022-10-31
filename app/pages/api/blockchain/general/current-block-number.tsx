import { getBlockNumber } from "@/lib/blockchain"
import { NextApiHandler } from "next"
import { withZod } from "@/lib/zod"
import { GetCurrentBlockNumber } from "@/schema/blockchain/general"
import { getToken } from "next-auth/jwt"

const handleGet = withZod(GetCurrentBlockNumber, async (req, res) => {
  const token = await getToken({ req })
  if (!token) { // No need to specify the address
    return res.status(401).json({ message: "Unauthorized" })
  }
  const currentBlockNumber = await getBlockNumber()
  return res.status(200).json(currentBlockNumber)
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
