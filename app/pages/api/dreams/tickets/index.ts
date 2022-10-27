import prisma from "@/lib/prisma"
import { withZod } from "@/lib/zod"
import { NextApiHandler } from "next"
import { issueTicket } from "@/schema/dreams"
import { getToken } from "next-auth/jwt"
import { getBlockNumber } from "@/lib/blockchain"
import { EXPIRATION_BLOCKS } from "@/constants/config"

const handlePost = withZod(issueTicket, async (req, res) => {
  const token = await getToken({ req })
  const address = req.body.senderAddress
  if (!token || token.sub !== address) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const dream = await prisma.dream.findUnique({
    where: { id: req.body.dreamId },
    include: { ticket: true },
  })
  if (!dream) {
    return res.status(404).json({ message: "Dream not found" })
  }
  if (dream.ticket) {
    return res.status(400).json({ message: "Ticket already exists" })
  }

  // If the dream is the genesis then create a new DreamToken
  // And if the ticket is deleted,
  // the token will no longer be minted with the id
  const tokenId =
    dream.tokenId === null
      ? (await prisma.dreamToken.create({ data: {} })).id
      : dream.tokenId
  const currentBlock = await getBlockNumber()
  const signature = "signature123" // ad hoc
  const ticket = await prisma.dreamTicket.create({
    data: {
      tokenId: tokenId,
      expiresAt: currentBlock + EXPIRATION_BLOCKS,
      senderAddress: address,
      dreamId: dream.id,
      signature,
    },
  })
  await prisma.dream.update({
    where: { id: dream.id },
    data: { status: "PENDING" },
  })
  return res.status(201).json(ticket)
})

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "POST":
      return handlePost(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
