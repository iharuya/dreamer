import prisma from "@/lib/prisma"
import { withZod } from "@/lib/zod"
import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"
import { GetIsDreamMinted } from "@/schema/blockchain/dreams"
import { isDreamMinted } from "@/lib/blockchain/dreams"

const handleGet = withZod(GetIsDreamMinted, async (req, res) => {
  const token = await getToken({ req })
  const ticket = await prisma.dreamTicket.findFirst({
    where: { id: req.query.ticketId },
  })
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" })
  }
  // Ticket can only be seen by its author
  if (!token || token.sub !== ticket.senderAddress) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const result = await isDreamMinted(ticket.id)
  return res.status(200).json(result)
})

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGet(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
