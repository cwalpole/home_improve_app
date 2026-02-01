import { NextResponse } from "next/server";

function getOrigin(req: Request) {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost || req.headers.get("host");
  const proto = forwardedProto || (host?.startsWith("localhost") ? "http" : "https");
  const fallback = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return host ? `${proto}://${host}` : fallback;
}

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/", getOrigin(req)), { status: 303 });
  res.cookies.set({
    name: "session",
    value: "",
    path: "/",
    maxAge: 0,
  });
  return res;
}
