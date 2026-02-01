import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const COOKIE_NAME = "session";

async function getJwtSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is required for login.");
  }
  return new TextEncoder().encode(secret);
}

export async function POST(req: Request) {
  let email: string | undefined;
  let password = "";

  if (req.headers.get("content-type")?.includes("application/json")) {
    const body = await req.json().catch(() => null);
    email = body?.email?.toString().toLowerCase().trim();
    password = body?.password?.toString() ?? "";
  } else {
    const form = await req.formData().catch(() => null);
    email = form?.get("email")?.toString().toLowerCase().trim();
    password = form?.get("password")?.toString() ?? "";
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const secret = await getJwtSecret();
  const token = await new SignJWT({
    sub: user.id.toString(),
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
