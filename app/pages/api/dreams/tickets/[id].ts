import prisma from "@/lib/prisma"
import { withZod } from "@/lib/zod"
import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"
import { updateTicket, deleteTicket, getTicket } from "@/schema/dreams"
import {
  getBlockNumber,
  isDreamMinted,
  signToMintDream,
} from "@/lib/blockchain"
import { Dream, DreamTicket } from "@prisma/client"
import { EXPIRATION_BLOCKS } from "@/constants/contracts/dreamer"
import { SERVER_CHAIN_ID } from "@/constants/config"

const checkIfTicketIsMutable = async (
  ticket: DreamTicket
): Promise<{
  yes: boolean
  message?: string
}> => {
  if (ticket.status !== "PENDING") {
    return {
      yes: false,
      message: "Ticket is processing or completed",
    }
  }
  const currentBlock = await getBlockNumber()
  if (currentBlock <= ticket.expiresAt) {
    return {
      yes: false,
      message: "Ticket is not expired",
    }
  }
  if (await isDreamMinted(ticket.id)) {
    return {
      yes: false,
      message:
        "The corresponding token has been minted. Please generate and publish the dream.",
    }
  }
  // Now currentBlock might not be the latest one
  return {
    yes: true,
  }
}

const handleGet = withZod(getTicket, async (req, res) => {
  const token = await getToken({ req })
  const ticket = await prisma.dreamTicket.findFirst({
    where: { id: req.query.id },
    include: { dream: true },
  })
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" })
  }
  // Ticket can only be seen by its author
  if (!token || token.sub !== ticket.senderAddress) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  return res.status(200).json(ticket)
})
export type Get = DreamTicket & { dream: Dream }

const handlePatch = withZod(updateTicket, async (req, res) => {
  const token = await getToken({ req }) // Should use middleware to check if authenticated
  const ticket = await prisma.dreamTicket.findUnique({
    where: { id: req.query.id },
  })
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" })
  }
  if (!token || token.sub !== ticket.senderAddress) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const mutableTest = await checkIfTicketIsMutable(ticket)
  if (mutableTest.yes) {
    const currentBlock = await getBlockNumber()
    const newExpiration = currentBlock + EXPIRATION_BLOCKS[SERVER_CHAIN_ID]
    const newSignature = await signToMintDream(
      ticket.id,
      ticket.senderAddress,
      ticket.tokenId,
      newExpiration
    )
    const updatedTicket = await prisma.dreamTicket.update({
      where: { id: ticket.id },
      data: {
        expiresAt: newExpiration,
        signature: newSignature,
      },
      include: {
        dream: true,
      },
    })
    return res.status(200).json(updatedTicket)
  } else {
    return res.status(400).json({ message: mutableTest.message })
  }
})

const handleDelete = withZod(deleteTicket, async (req, res) => {
  const token = await getToken({ req })
  const ticket = await prisma.dreamTicket.findUnique({
    where: { id: req.query.id },
    include: { dream: true, token: true },
  })
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" })
  }
  if (!token || token.sub !== ticket.senderAddress) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const mutableTest = await checkIfTicketIsMutable(ticket)
  if (mutableTest.yes) {
    if (ticket.dream.generation === 0) {
      // This will also delete the ticket
      await prisma.dreamToken.delete({ where: { id: ticket.token.id } })
    } else {
      await prisma.dreamTicket.delete({ where: { id: ticket.id } })
    }
    await prisma.dream.update({
      where: { id: ticket.dreamId },
      data: { status: "DRAFT" },
    })
    return res.status(200).json({ message: "Deleted" })
  } else {
    return res.status(400).json({ message: mutableTest.message })
  }
})

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGet(req, res)
    case "PATCH":
      return handlePatch(req, res)
    case "DELETE":
      return handleDelete(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
