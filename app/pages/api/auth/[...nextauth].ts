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

            let user = await prisma.user.findUnique({
              where: {
                address: message.address,
              },
            })
            if (!user) {
              user = await prisma.user.create({
                data: {
                  address: message.address,
                },
              })
            }

            return {
              id: user.id,
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
        const user = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
        })
        if (!user) return session
        session.user = {
          id: user.id,
          address: user.address,
          name: user.name || undefined,
        }
        return session
      },
    },

    secret: process.env.NEXTAUTH_SECRET,
  }

  const ret = await NextAuth(req, res, authOptions)
  return ret
}

export default auth
