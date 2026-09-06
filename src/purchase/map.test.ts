import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decideFulfillment,
  isDryRun,
  isFulfillEventType,
  mapCheckoutSession,
  quantityFromSession,
  sessionEmail,
  shouldFulfillCheckoutEvent,
  splitCustomerName,
  HCG1_ITEM_CODE,
  HCG1_UNIT_RATE,
  PURCHASE_TAGS,
  type StripeCheckoutSession
} from "./map.ts";

function paidSession(overrides: Partial<StripeCheckoutSession> = {}): StripeCheckoutSession {
  return {
    id: "cs_test_123",
    object: "checkout.session",
    mode: "payment",
    payment_status: "paid",
    payment_intent: "pi_test_456",
    customer_details: {
      email: "Alex.Player@example.com",
      name: "Alex Player",
      phone: "+15555550199"
    },
    metadata: { product: "hcg1", item_code: "HCG1-PRO", quantity: "2" },
    amount_total: 25998,
    currency: "usd",
    ...overrides
  };
}

describe("checkout event selection", () => {
  it("fulfills paid embedded Checkout Session completions", () => {
    const session = paidSession();
    assert.equal(shouldFulfillCheckoutEvent("checkout.session.completed", session).fulfill, true);
    assert.equal(shouldFulfillCheckoutEvent("checkout.session.async_payment_succeeded", session).fulfill, true);
  });

  it("ignores payment_intent.succeeded so the same payment cannot double-create", () => {
    const gate = shouldFulfillCheckoutEvent("payment_intent.succeeded", {
      id: "pi_test_456",
      object: "payment_intent",
      payment_status: "paid"
    });
    assert.equal(gate.fulfill, false);
    assert.equal(gate.reason, "ignored_event");
    assert.equal(isFulfillEventType("payment_intent.succeeded"), false);
  });

  it("ignores unpaid or subscription sessions", () => {
    assert.equal(shouldFulfillCheckoutEvent("checkout.session.completed", paidSession({ payment_status: "unpaid" })).fulfill, false);
    assert.equal(shouldFulfillCheckoutEvent("checkout.session.completed", paidSession({ mode: "subscription" })).fulfill, false);
  });
});

describe("mapCheckoutSession", () => {
  it("maps a paid session to HCG1-PRO at $129.99 with purchase tags", () => {
    const mapped = mapCheckoutSession(paidSession());
    assert.equal(mapped.ok, true);
    if (!mapped.ok) return;
    assert.equal(mapped.plan.email, "alex.player@example.com");
    assert.equal(mapped.plan.customerName, "Alex Player");
    assert.equal(mapped.plan.firstName, "Alex");
    assert.equal(mapped.plan.lastName, "Player");
    assert.equal(mapped.plan.quantity, 2);
    assert.equal(mapped.plan.itemCode, HCG1_ITEM_CODE);
    assert.equal(mapped.plan.rate, HCG1_UNIT_RATE);
    assert.equal(mapped.plan.poNo, "cs_test_123");
    assert.equal(mapped.plan.stripePaymentIntentId, "pi_test_456");
    assert.deepEqual(mapped.plan.tags, [...PURCHASE_TAGS]);
    assert.match(mapped.plan.remarks, /session=cs_test_123/);
    assert.match(mapped.plan.remarks, /payment_intent=pi_test_456/);
  });

  it("requires an email and session id", () => {
    assert.equal(mapCheckoutSession(paidSession({ id: "" })).ok, false);
    assert.equal(
      mapCheckoutSession(paidSession({ customer_details: { email: null }, customer_email: null })).ok,
      false
    );
  });

  it("falls back to amount_total / $129.99 when quantity metadata is missing", () => {
    assert.equal(quantityFromSession(paidSession({ metadata: {}, amount_total: 38997, line_items: null })), 3);
    assert.equal(quantityFromSession({ line_items: { data: [{ quantity: 4 }] } }), 4);
    assert.equal(sessionEmail({ customer_email: "Player@Site.ORG" }), "player@site.org");
  });

  it("splits names and uses the email local-part when Stripe has no name", () => {
    assert.deepEqual(splitCustomerName("Jamie Lee Curtis", "x@y.com").firstName, "Jamie");
    assert.equal(splitCustomerName(undefined, "headset-fan@hcgamerlife.org").customerName, "headset-fan");
  });
});

describe("idempotency decision", () => {
  it("creates when no order exists", () => {
    assert.deepEqual(decideFulfillment(null), { action: "create" });
  });

  it("does not create again for a submitted order with the same Stripe id", () => {
    assert.deepEqual(decideFulfillment({ name: "SAL-ORD-0001", docstatus: 1 }), {
      action: "duplicate",
      salesOrder: "SAL-ORD-0001"
    });
  });

  it("resubmits a leftover draft instead of inserting a second order", () => {
    assert.deepEqual(decideFulfillment({ name: "SAL-ORD-0002", docstatus: 0 }), {
      action: "submit_existing",
      salesOrder: "SAL-ORD-0002"
    });
  });
});

describe("dry-run flag", () => {
  it("accepts 1/true/yes on either env name", () => {
    assert.equal(isDryRun({ ERP_DRY_RUN: "1" }), true);
    assert.equal(isDryRun({ PURCHASE_DRY_RUN: "true" }), true);
    assert.equal(isDryRun({ ERP_DRY_RUN: "yes" }), true);
    assert.equal(isDryRun({}), false);
  });
});
