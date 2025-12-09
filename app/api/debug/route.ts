export async function GET() {
  return Response.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "EXISTS (hidden)" : "MISSING",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "MISSING",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "EXISTS (hidden)" : "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  });
}
