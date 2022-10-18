import type NextAuth from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    address: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string
  }
}
