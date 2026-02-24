import { NextResponse } from "next/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function POST(req: Request) {
  if (!process.env.CLOUDINARY_URL) {
    console.error("[cloudinary] CLOUDINARY_URL is not set");
  }
  const cfg = cloudinary.config();
  console.error("[cloudinary] config", {
    hasCloudinaryUrl: Boolean(process.env.CLOUDINARY_URL),
    cloudName: cfg.cloud_name || null,
  });
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "blog-covers",
            resource_type: "image",
          },
          (err, res) => {
            if (err) return reject(err);
            if (!res) return reject(new Error("Upload failed"));
            resolve(res);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[cloudinary] upload failed", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
