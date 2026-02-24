import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const preferredCity =
    cookieStore.get("preferred-city")?.value?.trim().toLowerCase() || "calgary";

  redirect(`/${preferredCity}`);
}
