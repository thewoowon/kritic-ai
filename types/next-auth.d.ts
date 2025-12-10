import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      userId?: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    userId?: string
    accessToken?: string
  }
}
