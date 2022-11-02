import prisma from "@/lib/prisma"
import { withZod } from "@/lib/zod"
import { NextApiHandler } from "next"
import { GenerateImage } from "@/schema/dreams"
import { isDreamMinted } from "@/lib/blockchain/dreams"
import { mockRequestImage } from "@/lib/ai"
import { Dream, DreamImage, DreamTicket } from "@prisma/client"

const handlePost = withZod(GenerateImage, async (req, res) => {
  // no need to authorize
  const dream = await prisma.dream.findUnique({
    where: { id: req.body.dreamId },
    include: { ticket: true, parent: { include: { image: true } } },
  })
  if (!dream) {
    return res.status(404).json({ message: "Dream not found" })
  }
  if (!dream.ticket) {
    return res.status(404).json({ message: "Ticket not found" })
  }
  if (dream.ticket.status !== "PENDING") {
    return res
      .status(400)
      .json({ message: "Generation is processing or completed" })
  }
  if (!(await isDreamMinted(dream.ticket.id))) {
    return res.status(400).json({ message: "Token mint could not be verified" })
  }

  await prisma.dreamTicket.update({
    where: { id: dream.ticket.id },
    data: { status: "PROCESSING" },
  })

  // Wanna use server push to show the progress...
  let parentFilename: string | undefined
  if (dream.parent) {
    if (dream.parent.image) {
      parentFilename = dream.parent.image.filename
    } else {
      res.status(400).json({ message: "Parent dream does not have an image" })
    }
  }
  const { filename, nsfw, errorMessage } = await mockRequestImage(
    dream.prompt,
    parentFilename
  )

  if (errorMessage) {
    console.error(errorMessage)
    await prisma.dreamTicket.update({
      where: { id: dream.ticket.id },
      data: { status: "PENDING" },
    })
    res
      .status(500)
      .json({ message: "Image generation failed. Please try again later." })
  }

  let newDream
  if (nsfw) {
    newDream = await prisma.dream.update({
      where: { id: dream.id },
      data: {
        status: "BANNED",
      },
      include: {
        image: true,
        ticket: true,
      },
    })
  } else {
    await prisma.dreamImage.create({
      data: {
        filename: filename as string,
        dreamId: dream.id,
      },
    })
    newDream = await prisma.dream.update({
      where: { id: dream.id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      include: {
        image: true,
        ticket: true,
      },
    })
  }
  await prisma.dreamTicket.update({
    where: { id: dream.ticket.id },
    data: { status: "COMPLETED" },
  })
  return res.status(201).json(newDream)
})
export type Post = Dream & { image: DreamImage | null; ticket: DreamTicket }

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "POST":
      return handlePost(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
