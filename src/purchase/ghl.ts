/** HighLevel purchase tags. Reuses the quiz PIT / location upsert pattern. */

import { ghlLocationId, ghlPrivateToken, upsertTaggedContact, type QuizEnv } from "../quiz/ghl.ts";
import { PURCHASE_GHL_SOURCE, type PurchasePlan } from "./map.ts";

export type PurchaseGhlResult = {
  contactId: string | null;
  isNew: boolean;
  skipped: boolean;
};

export async function upsertPurchaseContact(env: QuizEnv, plan: PurchasePlan): Promise<PurchaseGhlResult> {
  if (!ghlPrivateToken(env)) {
    return { contactId: null, isNew: false, skipped: true };
  }

  const upsert = await upsertTaggedContact(env, {
    email: plan.email,
    firstName: plan.firstName,
    lastName: plan.lastName,
    tags: plan.tags,
    source: PURCHASE_GHL_SOURCE
  });

  return { contactId: upsert.contactId, isNew: upsert.isNew, skipped: false };
}

export function purchaseLocationId(env: QuizEnv): string {
  return ghlLocationId(env);
}
