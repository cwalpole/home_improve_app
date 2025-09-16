import { NextResponse } from "next/server";
import { z } from "zod";
// Save to DB (and optionally send email via Resend/Postmark)

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  // TODO: persist inquiry, send email
  return NextResponse.json({ ok: true });
}
