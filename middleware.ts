// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { matcher: ["/admin/:path*"] };

export function middleware(req: NextRequest) {
  const creds = process.env.ADMIN_BASIC_AUTH; // "user:pass"
  if (!creds) return NextResponse.next();

  const header = req.headers.get("authorization") || ""; // e.g. "Basic dXNlcjpwYXNz"
  const expected = "Basic " + btoa(creds); // "Basic " + base64("user:pass")

  if (header === expected) return NextResponse.next();

  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}
