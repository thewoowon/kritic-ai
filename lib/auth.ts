import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // 백엔드에 사용자 생성/로그인 요청
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/web/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: account?.id_token,
            email: user.email,
            name: user.name,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          // 백엔드에서 받은 user_id와 JWT access_token 저장
          if (data.user_id) {
            user.id = data.user_id.toString()
          }
          if (data.access_token) {
            // @ts-ignore - 커스텀 프로퍼티
            user.backendAccessToken = data.access_token
          }
          return true
        }
        return true // 백엔드 실패해도 로그인은 허용
      } catch (error) {
        console.error("Backend auth error:", error)
        return true // 에러 발생해도 로그인은 허용
      }
    },
    async jwt({ token, account, profile, user }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.id = profile.sub
      }
      if (user?.id) {
        token.userId = user.id
      }
      // @ts-ignore - 커스텀 프로퍼티
      if (user?.backendAccessToken) {
        // @ts-ignore - 커스텀 프로퍼티
        token.backendAccessToken = user.backendAccessToken
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        if (token.userId) {
          session.user.userId = token.userId as string
        }
        // @ts-ignore - 커스텀 프로퍼티
        if (token.backendAccessToken) {
          // @ts-ignore - 커스텀 프로퍼티
          session.user.backendAccessToken = token.backendAccessToken as string
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}
