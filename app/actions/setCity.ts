"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setCity(citySlug: string, path: string = "/") {
  (await cookies()).set("preferred-city", citySlug, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath(path);
}
