"use client";

import { useMemo, useState } from "react";
import styles from "../../admin.module.css";
import { SubscriptionStatus, SubscriptionTier } from "@prisma/client";

type Row = {
  id: number;
  companyName: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  interval: string;
  price: string;
  startDate: string;
  label: string;
  updatedDate: string;
};

export default function CurrentSubscriptionsTable({ rows }: { rows: Row[] }) {
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (tierFilter !== "ALL" && row.tier !== tierFilter) return false;
      if (statusFilter !== "ALL" && row.status !== statusFilter) return false;
      return true;
    });
  }, [rows, tierFilter, statusFilter]);

  return (
    <>
      <div className={styles.filterBar}>
        <label className={styles.field}>
          <span className={styles.label}>Tier</span>
          <select
            className={styles.select}
            value={tierFilter}
            onChange={(event) => setTierFilter(event.target.value)}
          >
            <option value="ALL">All</option>
            {Object.values(SubscriptionTier).map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Status</span>
          <select
            className={styles.select}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All</option>
            {Object.values(SubscriptionStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={`${styles.table} ${styles.tableCols8}`} style={{ marginTop: 16 }}>
        <div className={styles.tableHead}>
          <span>Company</span>
          <span>Tier</span>
          <span>Status</span>
          <span>Interval</span>
          <span>Price (CAD)</span>
          <span>Label</span>
          <span>Start</span>
          <span>Updated</span>
        </div>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>No matching subscriptions.</div>
        ) : (
          filtered.map((row) => (
            <div key={row.id} className={styles.tableRow}>
              <span>{row.companyName}</span>
              <span>{row.tier}</span>
              <span>{row.status}</span>
              <span>{row.interval}</span>
              <span>{row.price}</span>
              <span>{row.label || "—"}</span>
              <span>{row.startDate}</span>
              <span>{row.updatedDate}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
