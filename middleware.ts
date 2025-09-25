// middleware.ts
import { NextResponse, NextRequest } from "next/server";

// ---- Config ----
// Run on admin + global services + city services routes
export const config = {
  matcher: [
    "/admin/:path*",
    "/services",
    "/services/:path*",
    "/:city/services",
    "/:city/services/:path*",
  ],
};

const DEFAULT_CITY = "calgary";

// Safe, light normalizer
function normalizeCity(input?: string | null) {
  return (input || "").toLowerCase().trim();
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // --- 1) Admin Basic Auth ---
  if (pathname.startsWith("/admin")) {
    const creds = process.env.ADMIN_BASIC_AUTH; // "user:pass"
    if (!creds) return NextResponse.next();

    const header = req.headers.get("authorization") || ""; // e.g. "Basic dXNlcjpwYXNz"
    const expected = "Basic " + btoa(creds); // Edge runtime has btoa
    if (header === expected) return NextResponse.next();

    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  // --- 2) City resolution for services routes (no redirects) ---
  // Priority: ?city= → cookie → city segment (/{city}/services) → default
  const res = NextResponse.next();

  // If URL has ?city=, set cookie so global pages can pick it up
  const cityFromQuery = normalizeCity(url.searchParams.get("city"));
  if (cityFromQuery) {
    res.cookies.set("preferred-city", cityFromQuery, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  // If path is /{city}/services...
  let cityFromPath: string | undefined;
  const cityPathMatch = pathname.match(/^\/([^\/]+)\/services(?:\/.*)?$/i);
  if (cityPathMatch) {
    cityFromPath = normalizeCity(cityPathMatch[1]);
  }

  const city =
    cityFromQuery ||
    normalizeCity(req.cookies.get("preferred-city")?.value) ||
    cityFromPath ||
    DEFAULT_CITY;

  // Pass to server components / route handlers
  res.headers.set("x-city", city);

  return res;
}
