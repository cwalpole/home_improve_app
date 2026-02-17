import prisma from "@/lib/prisma";
import styles from "../../admin.module.css";
import CurrentSubscriptionsTable from "./CurrentSubscriptionsTable";

export default async function CurrentSubscriptionsPage() {
  const currentSubscriptions = await prisma.subscription.findMany({
    where: { isCurrent: true },
    include: { company: { select: { id: true, name: true } } },
    orderBy: [{ updatedAt: "desc" }],
  });

  const rows = currentSubscriptions.map((sub) => ({
    id: sub.id,
    companyName: sub.company.name,
    tier: sub.tier,
    status: sub.status,
    interval: sub.interval,
    price: (sub.priceCents / 100).toFixed(2),
    startDate: sub.startedAt.toISOString().slice(0, 10),
    label: sub.customLabel || "",
    updatedDate: sub.updatedAt.toISOString().slice(0, 10),
  }));

  return (
    <section className={styles.section}>
      <div className={styles.row} style={{ gridTemplateColumns: "1fr auto" }}>
        <h2 style={{ margin: 0 }}>Current Subscriptions</h2>
      </div>

      <CurrentSubscriptionsTable rows={rows} />
    </section>
  );
}
