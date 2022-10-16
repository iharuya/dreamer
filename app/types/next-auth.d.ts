import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      address: string
      name?: string
    }
  }
  
  interface User {
    id: string
    address: string
    name?: string
  }
}


