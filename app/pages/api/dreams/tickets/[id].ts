import prisma from "@/lib/prisma"
import { withZod } from "@/lib/zod"
import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"
import { updateTicket, deleteTicket } from "@/schema/dreams"
import { getBlockNumber, isDreamMinted } from "@/lib/blockchain"
import { DreamTicket } from "@prisma/client"
import { EXPIRATION_BLOCKS } from "@/constants/config"

const checkIfTicketIsMutable = async (
  ticket: DreamTicket
): Promise<{
  yes: boolean
  errorCode?: number
  message?: string
}> => {
  if (ticket.status !== "PENDING") {
    return {
      yes: false,
      errorCode: 400,
      message: "Ticket is processing or completed",
    }
  }
  const currentBlock = await getBlockNumber()
  if (currentBlock <= ticket.expiresAt) {
    return {
      yes: false,
      errorCode: 400,
      message: "Ticket is not expired",
    }
  }
  if (await isDreamMinted(ticket.id)) {
    return {
      yes: false,
      errorCode: 400,
      message:
        "The corresponding token has been minted. Please generate and publish the dream.",
    }
  }
  // Now currentBlock might not be the latest one
  return {
    yes: true,
  }
}

// even though expired, token has already been minted
const handleUpdate = withZod(updateTicket, async (req, res) => {
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
    const newSignature = "newSig" // ad hoc
    const newTicket = await prisma.dreamTicket.update({
      where: { id: ticket.id },
      data: { expiresAt: currentBlock + EXPIRATION_BLOCKS, signature: newSignature },
    })
    return res.status(200).json(newTicket)
  } else {
    return res
      .status(mutableTest.errorCode as number)
      .json({ message: mutableTest.message })
  }
})

const handleDelete = withZod(deleteTicket, async (req, res) => {
  const token = await getToken({ req })
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
    await prisma.dreamTicket.delete({ where: { id: ticket.id } })
    await prisma.dream.update({
      where: { id: ticket.dreamId },
      data: { status: "DRAFT" },
    })
    return res.status(200).json({ message: "Deleted" })
  } else {
    return res
      .status(mutableTest.errorCode as number)
      .json({ message: mutableTest.message })
  }
})

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "PATCH":
      return handleUpdate(req, res)
    case "DELETE":
      return handleDelete(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
