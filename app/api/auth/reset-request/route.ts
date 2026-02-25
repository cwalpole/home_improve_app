import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
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

function redirectWithStatus(req: Request, status: string) {
  const url = new URL("/reset-password", getOrigin(req));
  url.searchParams.set("status", status);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(req: Request) {
  let email = "";
  if (req.headers.get("content-type")?.includes("application/json")) {
    const body = await req.json().catch(() => null);
    email = body?.email?.toString().toLowerCase().trim() ?? "";
  } else {
    const form = await req.formData().catch(() => null);
    email = form?.get("email")?.toString().toLowerCase().trim() ?? "";
  }

  if (!email) {
    if (wantsHtml(req)) {
      return redirectWithStatus(req, "missing");
    }
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const resetUrl = `${getOrigin(req)}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a;">
          <h2 style="margin: 0 0 12px;">Reset your password</h2>
          <p>Click the link below to reset your password. This link expires in 1 hour.</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
        </div>
      `,
    });
  }

  if (wantsHtml(req)) {
    return redirectWithStatus(req, "sent");
  }
  return NextResponse.json({ ok: true });
}
