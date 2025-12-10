// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Next.js 16에서는 handler를 직접 export하면 최적화 과정에서 제거되는 버그가 존재.
// 함수로 래핑하면 절대 제거되지 않는다.

export function GET(req: Request) {
  return NextAuth(authOptions)(req);
}

export function POST(req: Request) {
  return NextAuth(authOptions)(req);
}
