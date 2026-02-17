"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useState } from "react";
import {
  assignCompanySubscription,
  type SubscriptionActionState,
} from "../../actions/companySubscriptions";
import {
  BillingInterval,
  SubscriptionStatus,
  SubscriptionTier,
} from "@prisma/client";
import styles from "../../admin.module.css";

type PlanOption = {
  id: number;
  tier: SubscriptionTier;
  interval: BillingInterval;
  currency: string;
  priceCents: number;
};

type CurrentSubscription = {
  tier: SubscriptionTier;
  interval: BillingInterval;
  status: SubscriptionStatus;
  currency: string;
  priceCents: number;
  planId: number | null;
  customLabel: string | null;
  startedAt: Date;
};

const initialState: SubscriptionActionState = {
  ok: false,
  error: null,
  status: null,
};

function SubmitRow({
  ok,
  error,
}: {
  ok: boolean;
  error: string | null;
}) {
  const { pending } = useFormStatus();
  return (
    <div className={styles.actionsRow}>
      {ok ? <span className={styles.savedMessage}>Saved</span> : null}
      {error ? <span className={styles.errorMessage}>{error}</span> : null}
      <button className={styles.btn} type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save subscription"}
      </button>
    </div>
  );
}

export default function SubscriptionForm({
  companyId,
  plans,
  currentSubscription,
  formId,
}: {
  companyId: number;
  plans: PlanOption[];
  currentSubscription: CurrentSubscription | null;
  formId: string;
}) {
  const [state, formAction] = useActionState(
    assignCompanySubscription.bind(null, companyId),
    initialState
  );
  const [statusValue, setStatusValue] = useState<SubscriptionStatus>(
    currentSubscription?.status || "ACTIVE"
  );

  useEffect(() => {
    if (state.status && state.status !== statusValue) {
      setStatusValue(state.status);
    }
  }, [state.status, statusValue]);

  return (
    <form id={formId} className={styles.subscriptionForm} action={formAction}>
      <div className={styles.subscriptionStatusRow}>
        <select
          key={state.status || currentSubscription?.status || "ACTIVE"}
          id="subscriptionStatus"
          name="status"
          className={styles.select}
          defaultValue={state.status || currentSubscription?.status || "ACTIVE"}
          onChange={(event) => setStatusValue(event.target.value as SubscriptionStatus)}
        >
          {Object.values(SubscriptionStatus).map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
        <input
          id="startedAt"
          name="startedAt"
          type="date"
          className={`${styles.input} ${styles.dateInput}`}
          defaultValue={
            currentSubscription?.startedAt
              ? new Date(currentSubscription.startedAt).toISOString().slice(0, 10)
              : ""
          }
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="planId">
          Assign from plan (recommended)
        </label>
        <select
          id="planId"
          name="planId"
          className={styles.select}
          defaultValue=""
        >
          <option value="">-- Select plan --</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.tier} · {plan.interval} · {plan.currency}{" "}
              {(plan.priceCents / 100).toFixed(2)}
            </option>
          ))}
        </select>
        <p className={styles.helperText}>
          Choosing a plan will override tier, interval, and price fields below.
        </p>
      </div>

      <div className={styles.subscriptionGrid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="tier">
            Tier
          </label>
          <select
            id="tier"
            name="tier"
            className={styles.select}
            defaultValue={currentSubscription?.tier || ""}
          >
            <option value="">—</option>
            {Object.values(SubscriptionTier).map((tierOption) => (
              <option key={tierOption} value={tierOption}>
                {tierOption}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="interval">
            Interval
          </label>
          <select
            id="interval"
            name="interval"
            className={styles.select}
            defaultValue={currentSubscription?.interval || ""}
          >
            <option value="">—</option>
            {Object.values(BillingInterval).map((intervalOption) => (
              <option key={intervalOption} value={intervalOption}>
                {intervalOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.subscriptionGrid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="priceDollars">
            Price (CAD dollars)
          </label>
          <input
            id="priceDollars"
            name="priceDollars"
            type="number"
            step="0.01"
            min="0"
            className={styles.input}
            defaultValue={
              currentSubscription
                ? (currentSubscription.priceCents / 100).toFixed(2)
                : ""
            }
            placeholder="format: 25.00"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Currency</label>
          <div className={styles.input} aria-readonly="true">
            CAD
          </div>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="customLabel">
          Custom label (optional)
        </label>
        <input
          id="customLabel"
          name="customLabel"
          type="text"
          className={styles.input}
          defaultValue={currentSubscription?.customLabel || ""}
          placeholder="e.g. Enterprise agreement"
        />
      </div>

      <SubmitRow ok={state.ok} error={state.error} />
    </form>
  );
}
