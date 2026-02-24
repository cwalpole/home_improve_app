"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BillingInterval, SubscriptionStatus, SubscriptionTier } from "@prisma/client";

export type SubscriptionActionState = {
  ok: boolean;
  error: string | null;
  status: SubscriptionStatus | null;
};

export async function assignCompanySubscription(
  companyId: number,
  _prev: SubscriptionActionState,
  formData: FormData
): Promise<SubscriptionActionState> {
  try {
    const planIdRaw = formData.get("planId")?.toString().trim();
    const status = (formData.get("status")?.toString() ||
      "ACTIVE") as SubscriptionStatus;

    let tier = SubscriptionTier.FREE;
    let interval = BillingInterval.MONTH;
    let currency = "CAD";
    let priceCents = 0;
    const customLabel = formData.get("customLabel")?.toString().trim() || null;
    const startedAtRaw = formData.get("startedAt")?.toString().trim() || "";
    const startedAt = startedAtRaw ? new Date(startedAtRaw) : null;

    if (planIdRaw) {
      const plan = await prisma.plan.findUnique({
        where: { id: Number(planIdRaw) },
      });
      if (!plan) {
        return { ok: false, error: "Plan not found.", status };
      }
      tier = plan.tier;
      interval = plan.interval;
      currency = plan.currency;
      priceCents = plan.priceCents;

      const existing = await prisma.subscription.findFirst({
        where: { companyId, isCurrent: true },
      });
      if (existing) {
        await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            tier,
            interval,
            status,
            currency,
            priceCents,
            planId: plan.id,
            customLabel: null,
            isCurrent: true,
            ...(startedAt ? { startedAt } : {}),
          },
        });
      } else {
        await prisma.subscription.create({
          data: {
            companyId,
            tier,
            interval,
            status,
            currency,
            priceCents,
            planId: plan.id,
            isCurrent: true,
            ...(startedAt ? { startedAt } : {}),
          },
        });
      }

      revalidatePath(`/admin/companies/${companyId}`);
      return { ok: true, error: null, status };
    }

    const existing = await prisma.subscription.findFirst({
      where: { companyId, isCurrent: true },
    });
    if (existing) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          tier,
          interval,
          status,
          currency,
          priceCents,
          planId: null,
          customLabel,
          isCurrent: true,
          ...(startedAt ? { startedAt } : {}),
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          companyId,
          tier,
          interval,
          status,
          currency,
          priceCents,
          planId: null,
          customLabel,
          isCurrent: true,
          ...(startedAt ? { startedAt } : {}),
        },
      });
    }

    revalidatePath(`/admin/companies/${companyId}`);
    return { ok: true, error: null, status };
  } catch {
    return { ok: false, error: "Save failed. Try again.", status: null };
  }
}
