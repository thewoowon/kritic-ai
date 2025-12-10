import NextAuth from "next-auth"
import { authOptions } from "../../../../lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

const handler = NextAuth(authOptions)

// 💥 여기가 핵심: Next.js 16 라우터가 이 default export를 필요로 한다.
export default handler;

export const GET = handler;
export const POST = handler;
