import prisma from "@/lib/prisma";
import styles from "../admin.module.css";
import { createPlan, updatePlan, deletePlan, type ActionState } from "../actions/subscriptions";
import { BillingInterval, SubscriptionTier } from "@prisma/client";

const initialState: ActionState = { ok: false, error: null };

export default async function SubscriptionsAdminPage() {
  const plans = await prisma.plan.findMany({
    orderBy: [{ tier: "asc" }, { interval: "asc" }],
  });

  async function createPlanAction(formData: FormData) {
    "use server";
    await createPlan(initialState, formData);
  }

  async function updatePlanAction(formData: FormData) {
    "use server";
    await updatePlan(initialState, formData);
  }
  return (
    <section className={styles.section}>
      <div className={styles.row} style={{ gridTemplateColumns: "1fr auto" }}>
        <h2 style={{ margin: 0 }}>Subscriptions</h2>
      </div>

      <div className={styles.companyFormCard}>
        <div className={styles.companyFormIntro}>
          <h3 className={styles.companyFormTitle}>Add plan</h3>
          <p className={styles.companyFormHint}>Create monthly/yearly pricing for PRO and FEATURED.</p>
        </div>
        <form action={createPlanAction} className={styles.formStack}>
          <div className={`${styles.field} ${styles.halfWidth}`}>
            <label htmlFor="tier">Tier</label>
            <select id="tier" name="tier" className={styles.select} defaultValue="PRO">
              {Object.values(SubscriptionTier).map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>
          <div className={`${styles.field} ${styles.halfWidth}`}>
            <label htmlFor="interval">Interval</label>
            <select id="interval" name="interval" className={styles.select} defaultValue="MONTH">
              {Object.values(BillingInterval).map((interval) => (
                <option key={interval} value={interval}>
                  {interval}
                </option>
              ))}
            </select>
          </div>
          <div className={`${styles.field} ${styles.halfWidth}`}>
            <label htmlFor="priceDollars">Price (CAD)</label>
            <input
              id="priceDollars"
              name="priceDollars"
              type="number"
              step="0.01"
              min="0"
              className={styles.input}
              placeholder="format: 25.00"
              required
            />
          </div>
          <div className={styles.actionsRow}>
            <button type="submit" className={styles.btn}>
              Create plan
            </button>
          </div>
        </form>
      </div>

      <div className={styles.table} style={{ marginTop: 16 }}>
        <div className={styles.tableHead}>
          <span>Tier</span>
          <span>Interval</span>
          <span>Price (CAD)</span>
          <span></span>
        </div>
        {plans.length === 0 ? (
          <div className={styles.emptyState}>No plans yet.</div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className={styles.tableRow}>
              <span>{plan.tier}</span>
              <span>{plan.interval}</span>
              <form action={updatePlanAction} className={styles.inlineField}>
                <input type="hidden" name="id" value={plan.id} />
                <input
                  name="priceDollars"
                  type="number"
                  step="0.01"
                  min="0"
                  className={styles.input}
                  defaultValue={(plan.priceCents / 100).toFixed(2)}
                  style={{ maxWidth: 140 }}
                />
                <button type="submit" className={styles.btn}>
                  Save
                </button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await deletePlan(plan.id);
                }}
              >
                <button type="submit" className={`${styles.link} ${styles.logoutButton}`}>
                  Delete
                </button>
              </form>
            </div>
          ))
        )}
      </div>

    </section>
  );
}
