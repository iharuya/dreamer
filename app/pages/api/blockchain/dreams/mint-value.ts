import { NextApiHandler } from "next"
import { withZod } from "@/lib/zod"
import { getMintValue } from "@/lib/blockchain/dreams"
import { GetMintValue } from "@/schema/blockchain/dreams"
import { getToken } from "next-auth/jwt"

const handleGet = withZod(GetMintValue, async (req, res) => {
  const token = await getToken({ req })
  if (!token) {
    // No need to specify the address
    return res.status(401).json({ message: "Unauthorized" })
  }
  const value = await getMintValue(req.query.tokenId)
  return res.status(200).json(value)
})
export type Get = string

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGet(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
