// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Run on admin + legacy services routes
export const config = {
  matcher: ["/admin/:path*", "/services", "/services/:path*"],
};

// Change these to your defaults
const DEFAULT_REGION = "ab";
const DEFAULT_CITY = "calgary";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- 1) Admin basic auth (unchanged) ---
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

  // --- 2) Redirect legacy /services → /{region}/{city}/services[/*] ---
  if (pathname === "/services" || pathname.startsWith("/services/")) {
    const cookie = req.cookies.get("preferred-city")?.value; // e.g. "ab/calgary"
    let [region, city] = (cookie ?? `${DEFAULT_REGION}/${DEFAULT_CITY}`).split(
      "/"
    );
    if (!region || !city) {
      region = DEFAULT_REGION;
      city = DEFAULT_CITY;
    }

    const rest =
      pathname === "/services" ? "" : pathname.slice("/services/".length);

    const url = new URL(
      `/${region}/${city}/services${rest ? `/${rest}` : ""}`,
      req.url
    );
    url.search = req.nextUrl.search; // preserve query string

    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}
