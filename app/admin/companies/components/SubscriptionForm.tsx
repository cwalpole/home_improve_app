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
          defaultValue=""
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="planId">
          Subscription Plan
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
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="customLabel">
          Custom Label (Optional)
        </label>
        <input
          id="customLabel"
          name="customLabel"
          type="text"
          className={styles.input}
          defaultValue=""
          placeholder="e.g. Enterprise agreement"
        />
      </div>

      <SubmitRow ok={state.ok} error={state.error} />
    </form>
  );
}
