"use client";

import { usePathname } from "next/navigation";
import { setCity } from "@/app/actions/setCity";

type City = { slug: string; name: string };

export default function CitySwitcher({ cities }: { cities: City[] }) {
  const pathname = usePathname();

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const city = e.target.value;
    await setCity(city, pathname);
    // If on a service detail/list under /services, jump to SEO path
    if (pathname.startsWith("/services")) {
      window.location.href = `/${city}${pathname}`;
    }
  }

  return (
    <select onChange={onChange} defaultValue="">
      <option value="" disabled>
        Switch city…
      </option>
      {cities.map((c) => (
        <option key={c.slug} value={c.slug}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
