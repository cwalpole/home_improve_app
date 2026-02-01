// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

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
const SESSION_COOKIE = "session";

// Safe, light normalizer
function normalizeCity(input?: string | null) {
  return (input || "").toLowerCase().trim();
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // --- 1) Admin auth via signed session cookie ---
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const secret = process.env.AUTH_SECRET;

    if (!token || !secret) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret)
      );
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
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
