// app/city-switch/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get("to"); // expect "ab/calgary"
  const back = searchParams.get("back") || "/";
  if (!to || !/^[a-z]{2,3}\/[a-z0-9-]+$/.test(to)) {
    return NextResponse.redirect(new URL(back, req.url), 302);
  }
  const res = NextResponse.redirect(new URL(back, req.url), 302);
  res.cookies.set("preferred-city", to, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
