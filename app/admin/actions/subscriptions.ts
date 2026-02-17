"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BillingInterval, SubscriptionTier } from "@prisma/client";

export type ActionState = { ok: boolean; error: string | null };

export async function createPlan(
  prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const tier = fd.get("tier") as SubscriptionTier | null;
  const interval = fd.get("interval") as BillingInterval | null;
  const currency = "CAD";
  const priceDollarsRaw = fd.get("priceDollars");
  const priceCents = priceDollarsRaw
    ? Math.round(Number(priceDollarsRaw) * 100)
    : NaN;

  if (!tier || !interval || !currency || Number.isNaN(priceCents)) {
    return { ok: false, error: "Missing required fields" };
  }

  await prisma.plan.create({
    data: {
      tier,
      interval,
      currency,
      priceCents,
      isPublic: true,
    },
  });

  revalidatePath("/admin/subscriptions");
  return { ok: true, error: null };
}

export async function updatePlan(
  prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const id = Number(fd.get("id"));
  const priceDollarsRaw = fd.get("priceDollars");
  const priceCents = priceDollarsRaw
    ? Math.round(Number(priceDollarsRaw) * 100)
    : NaN;
  if (!id || Number.isNaN(priceCents)) {
    return { ok: false, error: "Missing fields" };
  }
  await prisma.plan.update({
    where: { id },
    data: { priceCents },
  });
  revalidatePath("/admin/subscriptions");
  return { ok: true, error: null };
}

export async function deletePlan(id: number): Promise<{ ok: boolean }> {
  await prisma.plan.delete({ where: { id } });
  revalidatePath("/admin/subscriptions");
  return { ok: true };
}
