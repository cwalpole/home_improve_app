import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Accept both FormData and JSON (we’ll just log for now)
  let payload: Record<string, any> = {};
  const contentType = req.headers.get("content-type") || "";

  try {
    if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const fd = await req.formData();
      fd.forEach((v, k) => (payload[k] = v));
    } else if (contentType.includes("application/json")) {
      payload = await req.json();
    }
  } catch {
    // ignore parsing errors
  }

  // TODO: send to CRM/Email/DB
  console.log("[contact]", payload);

  return NextResponse.json({ ok: true });
}
