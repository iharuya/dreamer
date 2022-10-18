import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextApiRequest, NextApiResponse } from "next"
import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"
import prisma from "@/lib/prismadb"

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    providers: [
      CredentialsProvider({
        name: "Ethereum",
        credentials: {
          message: {
            label: "Message",
            type: "text",
          },
          signature: {
            label: "Signature",
            type: "text",
          },
        },
        async authorize(credentials) {
          try {
            const nextAuthUrl = process.env.NEXTAUTH_URL
            if (!nextAuthUrl) return null
            if (!credentials) return null
            const message = new SiweMessage(JSON.parse(credentials.message))
            const nextAuthHost = new URL(nextAuthUrl).host
            if (message.domain !== nextAuthHost) return null
            if (message.nonce !== (await getCsrfToken({ req }))) return null

            const result = await message.verify({
              signature: credentials.signature,
            })
            if (!result.success) return null

            let account = await prisma.account.findUnique({
              where: { address: message.address },
            })

            if (!account) {
              account = await prisma.account.create({
                data: {
                  address: message.address,
                  first_signed_at: new Date(),
                },
              })
            } else if (!account.first_signed_at) {
              // record has been created by someone else but never signed in
              account = await prisma.account.update({
                where: { address: message.address },
                data: { first_signed_at: new Date() },
              })
            }

            return {
              id: account.address,
            }
          } catch (e) {
            console.error(e)
            return null
          }
        },
      }),
    ],

    callbacks: {
      async session({ session, token }) {
        session.address = token.sub
        return session
      },
    },

    secret: process.env.NEXTAUTH_SECRET,
  }

  return await NextAuth(req, res, authOptions)
}

export default auth
