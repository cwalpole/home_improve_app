import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

function toString(value: FormDataEntryValue | null) {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  return value.name;
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let name = "";
    let email = "";
    let phone = "";
    let preferredDate = "";
    let message = "";
    let city = "";
    let service = "";
    let companyWebsite = "";
    let loadedAtValue: number | null = null;

    if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const formData = await req.formData();
      name = toString(formData.get("name"));
      email = toString(formData.get("email"));
      phone = toString(formData.get("phone"));
      preferredDate = toString(formData.get("date"));
      message = toString(formData.get("message"));
      city = toString(formData.get("city"));
      service = toString(formData.get("service"));
      companyWebsite = toString(formData.get("companyWebsite"));
      const loadedAtRaw = toString(formData.get("loadedAt"));
      loadedAtValue = loadedAtRaw ? Number(loadedAtRaw) : null;
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      name = cleanString(body?.name);
      email = cleanString(body?.email);
      phone = cleanString(body?.phone);
      preferredDate = cleanString(body?.preferredDate);
      message = cleanString(body?.message);
      city = cleanString(body?.city);
      service = cleanString(body?.service);
      companyWebsite = cleanString(body?.companyWebsite);
      loadedAtValue =
        typeof body?.loadedAt === "number" ? body.loadedAt : null;
    }

    if (companyWebsite) {
      return NextResponse.json({ ok: true });
    }

    if (
      typeof loadedAtValue === "number" &&
      Date.now() - loadedAtValue < 1500
    ) {
      return NextResponse.json({ ok: true });
    }

    if (
      name.length < 2 ||
      name.length > 80 ||
      email.length < 5 ||
      email.length > 120 ||
      message.length < 10 ||
      message.length > 2000
    ) {
      return NextResponse.json({ error: "Invalid form" }, { status: 400 });
    }

    const toRaw = process.env.CONTACT_TO;
    const toList =
      toRaw
        ?.split(",")
        .map((value) => value.trim())
        .filter(Boolean) ?? [];
    if (!toList.length) {
      return NextResponse.json(
        { error: "Missing CONTACT_TO" },
        { status: 500 },
      );
    }

    const subject = `New ${service || "Service"} Service Inquiry${city ? ` (${city})` : ""}`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #0f172a;">
        <h2 style="margin: 0 0 12px;">New Service Inquiry</h2>
        <table style="width: 50%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: 600;">Name</td><td>${name || "—"}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Email</td><td>${email || "—"}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Phone</td><td>${phone || "—"}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Preferred Date</td><td>${preferredDate || "—"}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">City</td><td>${city || "—"}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600;">Service</td><td>${service || "—"}</td></tr>
        </table>
        <div style="margin-top: 16px;">
          <div style="font-weight: 600; margin-bottom: 6px;">Project Details</div>
          <div style="white-space: pre-wrap;">${message || "—"}</div>
        </div>
      </div>
    `;

    await sendEmail({
      to: toList.length === 1 ? toList[0] : toList,
      subject,
      html,
      replyTo: email || undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
