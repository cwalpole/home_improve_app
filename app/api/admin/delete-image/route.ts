import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function POST(req: Request) {
  const { publicId } = await req.json();

  if (!publicId) {
    return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
  }

  await cloudinary.uploader.destroy(publicId);
  return NextResponse.json({ success: true });
}

