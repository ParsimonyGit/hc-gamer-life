import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fulfillCheckoutSession, type FulfillDeps, type PurchaseEnv } from "./fulfill.ts";
import { handleStripeWebhook } from "./webhook.ts";
import { signStripePayload, verifyStripeSignature } from "./stripe.ts";
import { PURCHASE_TAGS, type PurchasePlan, type StripeCheckoutSession } from "./map.ts";

function paidSession(overrides: Partial<StripeCheckoutSession> = {}): StripeCheckoutSession {
  return {
    id: "cs_test_abc",
    object: "checkout.session",
    mode: "payment",
    payment_status: "paid",
    payment_intent: "pi_test_abc",
    customer_details: { email: "buyer@hcgamerlife.org", name: "Buyer One" },
    metadata: { quantity: "1", item_code: "HCG1-PRO" },
    amount_total: 12999,
    currency: "usd",
    ...overrides
  };
}

function memoryDeps() {
  const orders: Array<{ name: string; docstatus: number; customer?: string; poNo?: string }> = [];
  const customers: Array<{ name: string; email: string; ghl?: string }> = [];
  const ghl: Array<{ email: string; tags: string[] }> = [];
  let soSeq = 0;

  const deps: FulfillDeps = {
    async findSalesOrderByStripeId(stripeSessionId) {
      const found = orders.find((row) => row.poNo === stripeSessionId);
      return found ? { name: found.name, docstatus: found.docstatus, customer: found.customer } : null;
    },
    async upsertCustomer(plan) {
      let row = customers.find((entry) => entry.email === plan.email);
      if (!row) {
        row = { name: plan.customerName, email: plan.email };
        customers.push(row);
      }
      return { name: row.name };
    },
    async createSubmittedSalesOrder(plan, customer) {
      soSeq += 1;
      const name = `SAL-ORD-${String(soSeq).padStart(4, "0")}`;
      orders.push({ name, docstatus: 1, customer, poNo: plan.poNo });
      return { name, submitted: true };
    },
    async submitSalesOrder(name) {
      const row = orders.find((entry) => entry.name === name);
      if (!row) throw new Error("missing order");
      row.docstatus = 1;
      return { name, submitted: true };
    },
    async storeGhlContactId(customerName, contactId) {
      const row = customers.find((entry) => entry.name === customerName);
      if (row) row.ghl = contactId;
    },
    async upsertGhlPurchase(plan) {
      ghl.push({ email: plan.email, tags: plan.tags });
      return { contactId: "ghl_123", skipped: false };
    }
  };

  return { deps, orders, customers, ghl };
}

const env: PurchaseEnv = {
  ERP_API_KEY: "key",
  ERP_API_SECRET: "secret",
  GHL_PIT: "pit"
};

describe("fulfillCheckoutSession", () => {
  it("creates a customer + submitted SO and stamps GHL tags once", async () => {
    const { deps, orders, customers, ghl } = memoryDeps();
    const first = await fulfillCheckoutSession(env, paidSession(), deps);
    assert.equal(first.duplicate, false);
    assert.equal(first.salesOrder, "SAL-ORD-0001");
    assert.equal(first.customer, "Buyer One");
    assert.equal(first.ghlContactId, "ghl_123");
    assert.equal(customers[0]?.ghl, "ghl_123");
    assert.deepEqual(ghl[0]?.tags, [...PURCHASE_TAGS]);
    assert.equal(orders.length, 1);

    const replay = await fulfillCheckoutSession(env, paidSession(), deps);
    assert.equal(replay.duplicate, true);
    assert.equal(replay.salesOrder, "SAL-ORD-0001");
    assert.equal(orders.length, 1);
    assert.equal(ghl.length, 2);
  });

  it("submits a leftover draft instead of inserting another SO", async () => {
    const { deps, orders } = memoryDeps();
    orders.push({ name: "SAL-ORD-DRAFT", docstatus: 0, customer: "Buyer One", poNo: "cs_test_abc" });
    const result = await fulfillCheckoutSession(env, paidSession(), deps);
    assert.equal(result.duplicate, true);
    assert.equal(result.salesOrder, "SAL-ORD-DRAFT");
    assert.equal(result.submitted, true);
    assert.equal(orders.length, 1);
    assert.equal(orders[0]?.docstatus, 1);
  });

  it("returns a plan without writing when dry-run is set", async () => {
    const { deps, orders } = memoryDeps();
    const result = await fulfillCheckoutSession({ ...env, ERP_DRY_RUN: "1" }, paidSession(), deps);
    assert.equal(result.dryRun, true);
    assert.equal(result.plan.itemCode, "HCG1-PRO");
    assert.equal(orders.length, 0);
  });
});

describe("Stripe signature + webhook HTTP", () => {
  it("accepts a valid HMAC and rejects a bad one", async () => {
    const payload = JSON.stringify({ type: "checkout.session.completed" });
    const secret = "whsec_test";
    const header = await signStripePayload(payload, secret, 1_700_000_000);
    assert.equal(await verifyStripeSignature(payload, header, secret, 1_700_000_000), true);
    assert.equal(await verifyStripeSignature(payload, header, "whsec_other", 1_700_000_000), false);
    assert.equal(await verifyStripeSignature(payload, header, secret, 1_700_000_000 + 400), false);
  });

  it("returns 400 for a bad signature and 200 ignored for payment_intent.succeeded", async () => {
    const secret = "whsec_test";
    const ignored = JSON.stringify({
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_1", object: "payment_intent" } }
    });
    const header = await signStripePayload(ignored, secret, 1_700_000_000);
    const envWebhook: PurchaseEnv = { STRIPE_WEBHOOK_SECRET: secret, ERP_DRY_RUN: "1" };

    const bad = await handleStripeWebhook(
      new Request("https://hcgamerlife.org/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "t=1,v1=deadbeef" },
        body: ignored
      }),
      envWebhook
    );
    assert.equal(bad.status, 400);

    const ok = await handleStripeWebhook(
      new Request("https://hcgamerlife.org/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": header },
        body: ignored
      }),
      envWebhook
    );
    assert.equal(ok.status, 200);
    const body = (await ok.json()) as { ignored?: boolean; reason?: string };
    assert.equal(body.ignored, true);
    assert.equal(body.reason, "ignored_event");
  });

  it("dry-runs a paid checkout.session.completed without ERP writes", async () => {
    const secret = "whsec_test";
    const payload = JSON.stringify({
      id: "evt_1",
      type: "checkout.session.completed",
      data: { object: paidSession() }
    });
    const header = await signStripePayload(payload, secret, 1_700_000_000);
    const response = await handleStripeWebhook(
      new Request("https://hcgamerlife.org/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": header },
        body: payload
      }),
      { STRIPE_WEBHOOK_SECRET: secret, ERP_DRY_RUN: "true" }
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as { dryRun?: boolean; email?: string; itemCode?: string; quantity?: number };
    assert.equal(body.dryRun, true);
    assert.equal(body.email, "buyer@hcgamerlife.org");
    assert.equal(body.itemCode, "HCG1-PRO");
    assert.equal(body.quantity, 1);
  });
});

describe("purchase plan tags stay additive", () => {
  it("only requests customer + purchased-hcg1 tags", () => {
    const plan = {
      tags: [...PURCHASE_TAGS]
    } as PurchasePlan;
    assert.deepEqual(plan.tags, ["hcgl-customer", "hcgl-purchased-hcg1"]);
  });
});
