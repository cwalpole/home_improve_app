import { prisma } from "@/lib/prisma";
import AdminSection from "../../components/AdminSection";
import UpdateCityForm from "../UpdateCityForm";
import styles from "../../admin.module.css";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteCityById } from "../../actions/cities";

export default async function CityDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const cityId = Number(id);

  if (!cityId) {
    notFound();
  }

  const city = await prisma.city.findUnique({
    where: { id: cityId },
    select: {
      id: true,
      name: true,
      slug: true,
      regionCode: true,
      country: true,
    },
  });

  if (!city) {
    notFound();
  }

  return (
    <AdminSection
      title={`City · ${city.name}`}
      right={
        <Link className={`${styles.btn} ${styles.secondary}`} href="/admin/cities">
          ← Back to list
        </Link>
      }
    >
      <div className={styles.detailCard}>
        <UpdateCityForm
          id={city.id}
          name={city.name}
          slug={city.slug}
          regionCode={city.regionCode}
        />

        <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
          Country: {city.country}
        </div>

        <form
          action={async () => {
            "use server";
            await deleteCityById(city.id);
            redirect("/admin/cities");
          }}
        >
          <button type="submit" className={`${styles.btn} ${styles.danger}`}>
            Delete city
          </button>
        </form>
      </div>
    </AdminSection>
  );
}
