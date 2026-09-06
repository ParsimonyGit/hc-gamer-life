import { upsertPurchaseContact } from "./ghl.ts";
import { decideFulfillment, isDryRun, mapCheckoutSession, type PurchasePlan, type StripeCheckoutSession } from "./map.ts";
import { ErpClient, erpConfigured, erpItemCode, erpItemRate, type ErpEnv } from "./erp.ts";
import type { QuizEnv } from "../quiz/ghl.ts";

export type PurchaseEnv = ErpEnv &
  QuizEnv & {
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    ERP_DRY_RUN?: string;
    PURCHASE_DRY_RUN?: string;
  };

export type FulfillResult = {
  ok: true;
  dryRun?: boolean;
  duplicate?: boolean;
  submitted?: boolean;
  salesOrder?: string;
  customer?: string;
  ghlContactId?: string | null;
  ghlSkipped?: boolean;
  plan: PurchasePlan;
};

export type FulfillDeps = {
  findSalesOrderByStripeId: (stripeSessionId: string) => Promise<{ name: string; docstatus: number; customer?: string } | null>;
  upsertCustomer: (plan: PurchasePlan, ghlContactId?: string) => Promise<{ name: string }>;
  createSubmittedSalesOrder: (plan: PurchasePlan, customer: string) => Promise<{ name: string; submitted: boolean }>;
  submitSalesOrder: (name: string) => Promise<{ name: string; submitted: boolean }>;
  storeGhlContactId: (customerName: string, contactId: string) => Promise<void>;
  upsertGhlPurchase: (plan: PurchasePlan) => Promise<{ contactId: string | null; skipped: boolean }>;
};

export function createLiveFulfillDeps(env: PurchaseEnv): FulfillDeps {
  const erp = new ErpClient(env);
  return {
    findSalesOrderByStripeId: (id) => erp.findSalesOrderByStripeId(id),
    upsertCustomer: (plan, ghlContactId) => erp.upsertCustomer(plan, ghlContactId),
    createSubmittedSalesOrder: (plan, customer) => erp.createSubmittedSalesOrder(plan, customer),
    submitSalesOrder: (name) => erp.submitSalesOrder(name),
    storeGhlContactId: (customer, contactId) => erp.storeGhlContactId(customer, contactId),
    upsertGhlPurchase: (plan) => upsertPurchaseContact(env, plan)
  };
}

export async function fulfillCheckoutSession(
  env: PurchaseEnv,
  session: StripeCheckoutSession,
  deps?: FulfillDeps
): Promise<FulfillResult> {
  const mapped = mapCheckoutSession(session, {
    itemCode: erpItemCode(env),
    rate: erpItemRate(env)
  });
  if (!mapped.ok) throw new Error(mapped.error);
  const plan = mapped.plan;

  if (isDryRun(env)) {
    return { ok: true, dryRun: true, plan };
  }

  if (!erpConfigured(env)) {
    throw new Error("ERP is not configured (missing ERP_API_KEY or ERP_API_SECRET).");
  }

  const live = deps || createLiveFulfillDeps(env);
  const existing = await live.findSalesOrderByStripeId(plan.stripeSessionId);
  const decision = decideFulfillment(existing);
  const customer = await live.upsertCustomer(plan);

  let salesOrder = existing?.name;
  let submitted = existing ? existing.docstatus === 1 : false;
  let duplicate = false;

  if (decision.action === "duplicate") {
    duplicate = true;
    submitted = true;
    salesOrder = decision.salesOrder;
  } else if (decision.action === "submit_existing") {
    const result = await live.submitSalesOrder(decision.salesOrder);
    duplicate = true;
    submitted = result.submitted;
    salesOrder = result.name;
  } else {
    const created = await live.createSubmittedSalesOrder(plan, customer.name);
    submitted = created.submitted;
    salesOrder = created.name;
  }

  const ghl = await live.upsertGhlPurchase(plan);
  if (ghl.contactId) {
    try {
      await live.storeGhlContactId(customer.name, ghl.contactId);
    } catch (error) {
      console.warn(
        JSON.stringify({
          msg: "erp_ghl_contact_id_skipped",
          customer: customer.name,
          error: error instanceof Error ? error.message : "unknown"
        })
      );
    }
  }

  return {
    ok: true,
    duplicate,
    submitted,
    salesOrder,
    customer: existing?.customer || customer.name,
    ghlContactId: ghl.contactId,
    ghlSkipped: ghl.skipped,
    plan
  };
}
