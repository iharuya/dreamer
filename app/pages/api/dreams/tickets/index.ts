import prisma from "@/lib/prisma"
import { withZod } from "@/lib/zod"
import { NextApiHandler } from "next"
import { IssueTicket, GetTickets } from "@/schema/dreams"
import { getToken } from "next-auth/jwt"
import { getBlockNumber } from "@/lib/blockchain/general"
import { signToMintDream } from "@/lib/blockchain/dreams"
import { DREAM_EXPIRATION_BLOCKS } from "@/constants/chain"
import { Dream, DreamTicket } from "@prisma/client"
import { getUuidDecimalString } from "@/lib/utils"

const handleGet = withZod(GetTickets, async (req, res) => {
  const token = await getToken({ req })
  const address = req.query.senderAddress
  if (!token || token.sub !== address) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const tickets = await prisma.dreamTicket.findMany({
    where: { senderAddress: address },
    include: { dream: true },
    orderBy: [{ createdAt: "desc" }],
  })
  return res.status(200).json(tickets)
})
export type Get = (DreamTicket & { dream: Dream })[]

const handlePost = withZod(IssueTicket, async (req, res) => {
  const token = await getToken({ req })
  const address = req.body.senderAddress
  if (!token || token.sub !== address) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const dream = await prisma.dream.findUnique({
    where: { id: req.body.dreamId },
    include: { ticket: true, parent: { include: { ticket: true } } },
  })
  if (!dream) {
    return res.status(404).json({ message: "Dream not found" })
  }
  if (dream.dreamerAddress !== address) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  if (dream.ticket) {
    return res.status(400).json({ message: "Ticket already exists" })
  }

  console.log("hello")
  const currentBlock = await getBlockNumber()
  let tokenId
  if (dream.parent) {
    tokenId = dream.parent.ticket?.tokenId as string
  } else {
    // create new token
    tokenId = getUuidDecimalString()
    console.log(tokenId)
    await prisma.dreamToken.create({ data: { id: tokenId } })
  }

  const ticketId = getUuidDecimalString()
  const expiresAt = currentBlock + DREAM_EXPIRATION_BLOCKS
  const signature = await signToMintDream(ticketId, address, tokenId, expiresAt)
  const ticket = await prisma.dreamTicket.create({
    data: {
      id: ticketId,
      tokenId: tokenId,
      expiresAt: expiresAt,
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
export type Post = DreamTicket

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
