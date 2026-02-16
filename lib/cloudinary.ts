import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function deleteImage(publicId?: string | null) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };

