import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function getOrigin(req: Request) {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost || req.headers.get("host");
  const proto = forwardedProto || (host?.startsWith("localhost") ? "http" : "https");
  const fallback = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return host ? `${proto}://${host}` : fallback;
}

function wantsHtml(req: Request) {
  return (
    req.headers.get("accept")?.includes("text/html") ||
    req.headers.get("content-type")?.includes("application/x-www-form-urlencoded") ||
    req.headers.get("content-type")?.includes("multipart/form-data")
  );
}

function redirectWithError(req: Request, token: string, message: string) {
  const url = new URL(`/reset-password/${token}`, getOrigin(req));
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(req: Request) {
  let token = "";
  let password = "";
  let confirm = "";

  if (req.headers.get("content-type")?.includes("application/json")) {
    const body = await req.json().catch(() => null);
    token = body?.token?.toString() ?? "";
    password = body?.password?.toString() ?? "";
    confirm = body?.confirm?.toString() ?? "";
  } else {
    const form = await req.formData().catch(() => null);
    token = form?.get("token")?.toString() ?? "";
    password = form?.get("password")?.toString() ?? "";
    confirm = form?.get("confirm")?.toString() ?? "";
  }

  if (!token || !password) {
    if (wantsHtml(req)) {
      return redirectWithError(req, token, "Missing token or password.");
    }
    return NextResponse.json({ error: "Missing token or password." }, { status: 400 });
  }

  if (password.length < 8 || password.length > 128) {
    if (wantsHtml(req)) {
      return redirectWithError(req, token, "Password must be at least 8 characters.");
    }
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  if (confirm && confirm !== password) {
    if (wantsHtml(req)) {
      return redirectWithError(req, token, "Passwords do not match.");
    }
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const record = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!record) {
    if (wantsHtml(req)) {
      return redirectWithError(req, token, "Reset link is invalid or expired.");
    }
    return NextResponse.json({ error: "Reset link is invalid or expired." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  const res = wantsHtml(req)
    ? NextResponse.redirect(new URL("/login?reset=ok", getOrigin(req)), { status: 303 })
    : NextResponse.json({ ok: true });
  return res;
}
