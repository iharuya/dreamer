import { NextApiHandler, NextApiResponse } from "next"

import { getBlockNumber } from "@/lib/blockchain"

const handleGet = async (res: NextApiResponse) => {
  const currentBlockNumber = await getBlockNumber()
  return res.status(200).json(currentBlockNumber)
}
export type Get = number

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGet(res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
