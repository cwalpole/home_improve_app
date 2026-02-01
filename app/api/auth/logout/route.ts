import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), { status: 303 });
  res.cookies.set({
    name: "session",
    value: "",
    path: "/",
    maxAge: 0,
  });
  return res;
}
