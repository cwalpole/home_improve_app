import { NextResponse } from "next/server";
import crypto from "crypto";

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: { message?: string };
};

export async function POST(req: Request) {
  if (!process.env.CLOUDINARY_URL) {
    console.error("[cloudinary] CLOUDINARY_URL is not set");
  }
  const cloudinaryUrl = process.env.CLOUDINARY_URL || "";
  const parsed = cloudinaryUrl ? new URL(cloudinaryUrl) : null;
  const cloudName = parsed?.hostname || "";
  const apiKey = parsed?.username || "";
  const apiSecret = parsed?.password || "";
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  try {
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary credentials are missing." },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "blog-covers";
    const signatureBase = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha1")
      .update(`${signatureBase}${apiSecret}`)
      .digest("hex");

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("api_key", apiKey);
    uploadForm.append("timestamp", String(timestamp));
    uploadForm.append("signature", signature);
    uploadForm.append("folder", folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: uploadForm }
    );

    const text = await response.text();
    if (!response.ok) {
      console.error("[cloudinary] upload failed", {
        status: response.status,
        body: text.slice(0, 500),
      });
      return NextResponse.json(
        { error: `Cloudinary error ${response.status}` },
        { status: 500 }
      );
    }

    const data = JSON.parse(text) as CloudinaryUploadResponse;
    if (!data.secure_url || !data.public_id) {
      console.error("[cloudinary] unexpected response", {
        hasSecureUrl: Boolean(data.secure_url),
        hasPublicId: Boolean(data.public_id),
      });
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[cloudinary] upload failed", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
