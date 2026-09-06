/** Pure Stripe Checkout → ERP/GHL purchase mapping. No I/O. */

export const DEFAULT_ERP_URL = "https://admin.hcgamerlife.org";
export const HCG1_ITEM_CODE = "HCG1-PRO";
export const HCG1_UNIT_RATE = 129.99;
export const HCG1_UNIT_CENTS = 12999;
export const PURCHASE_TAGS = ["hcgl-customer", "hcgl-purchased-hcg1"] as const;
export const PURCHASE_GHL_SOURCE = "hcgl-stripe";
export const FULFILL_EVENTS = ["checkout.session.completed", "checkout.session.async_payment_succeeded"] as const;

export type StripeAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

export type StripeCheckoutSession = {
  id?: string;
  object?: string;
  mode?: string;
  payment_status?: string;
  payment_intent?: string | { id?: string } | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    address?: StripeAddress | null;
  } | null;
  metadata?: Record<string, string | undefined> | null;
  amount_total?: number | null;
  currency?: string | null;
  line_items?: { data?: Array<{ quantity?: number | null; price?: { id?: string } | null }> } | null;
};

export type PurchasePlan = {
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  email: string;
  customerName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  quantity: number;
  itemCode: string;
  rate: number;
  amountTotalCents: number | null;
  currency: string;
  tags: string[];
  remarks: string;
  poNo: string;
};

export type ExistingSalesOrder = {
  name: string;
  docstatus: number;
  customer?: string;
};

export type FulfillDecision =
  | { action: "create" }
  | { action: "duplicate"; salesOrder: string }
  | { action: "submit_existing"; salesOrder: string };

export function isFulfillEventType(type: string): boolean {
  return (FULFILL_EVENTS as readonly string[]).includes(type);
}

export function paymentIntentId(session: StripeCheckoutSession): string | null {
  const raw = session.payment_intent;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (raw && typeof raw === "object" && typeof raw.id === "string" && raw.id.trim()) return raw.id.trim();
  return null;
}

export function sessionEmail(session: StripeCheckoutSession): string {
  const raw = session.customer_details?.email || session.customer_email || "";
  return String(raw).trim().toLowerCase();
}

export function splitCustomerName(name: string | null | undefined, email: string): {
  customerName: string;
  firstName?: string;
  lastName?: string;
} {
  const trimmed = name?.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/);
    return {
      customerName: trimmed.slice(0, 140),
      firstName: parts[0]?.slice(0, 80) || undefined,
      lastName: parts.slice(1).join(" ").slice(0, 80) || undefined
    };
  }
  const local = email.split("@")[0]?.trim() || "HC GamerLife Customer";
  return { customerName: local.slice(0, 140) };
}

export function quantityFromSession(session: StripeCheckoutSession, rate = HCG1_UNIT_RATE): number {
  const meta = Number.parseInt(String(session.metadata?.quantity ?? ""), 10);
  if (Number.isFinite(meta) && meta >= 1) return Math.min(meta, 99);

  const lineQty = session.line_items?.data?.[0]?.quantity;
  if (typeof lineQty === "number" && Number.isFinite(lineQty) && lineQty >= 1) {
    return Math.min(Math.round(lineQty), 99);
  }

  const amount = session.amount_total;
  const unitCents = Math.round(rate * 100);
  if (typeof amount === "number" && amount > 0 && unitCents > 0) {
    const derived = Math.round(amount / unitCents);
    if (derived >= 1) return Math.min(derived, 99);
  }
  return 1;
}

export function shouldFulfillCheckoutEvent(
  type: string,
  session: StripeCheckoutSession
): { fulfill: boolean; reason: string } {
  if (!isFulfillEventType(type)) return { fulfill: false, reason: "ignored_event" };
  if (session.object && session.object !== "checkout.session") {
    return { fulfill: false, reason: "not_checkout_session" };
  }
  if (session.mode && session.mode !== "payment") return { fulfill: false, reason: "ignored_mode" };
  if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
    return { fulfill: true, reason: "paid_checkout" };
  }
  return { fulfill: false, reason: "not_paid" };
}

export function mapCheckoutSession(
  session: StripeCheckoutSession,
  opts?: { itemCode?: string; rate?: number }
): { ok: true; plan: PurchasePlan } | { ok: false; error: string } {
  const stripeSessionId = typeof session.id === "string" ? session.id.trim() : "";
  if (!stripeSessionId) return { ok: false, error: "Checkout session is missing an id" };

  const email = sessionEmail(session);
  if (!email || !email.includes("@")) return { ok: false, error: "Checkout session is missing a customer email" };

  const itemCode = (opts?.itemCode || session.metadata?.item_code || HCG1_ITEM_CODE).trim() || HCG1_ITEM_CODE;
  const rate = typeof opts?.rate === "number" && opts.rate > 0 ? opts.rate : HCG1_UNIT_RATE;
  const quantity = quantityFromSession(session, rate);
  const names = splitCustomerName(session.customer_details?.name, email);
  const stripePaymentIntentId = paymentIntentId(session);
  const phone = session.customer_details?.phone?.trim() || undefined;
  const currency = (session.currency || "usd").toLowerCase();
  const remarks = [
    "Paid in full via Stripe Checkout on hcgamerlife.org.",
    `session=${stripeSessionId}`,
    stripePaymentIntentId ? `payment_intent=${stripePaymentIntentId}` : null,
    `item=${itemCode} qty=${quantity} rate=${rate.toFixed(2)}`
  ]
    .filter(Boolean)
    .join(" ");

  return {
    ok: true,
    plan: {
      stripeSessionId,
      stripePaymentIntentId,
      email,
      customerName: names.customerName,
      firstName: names.firstName,
      lastName: names.lastName,
      phone,
      quantity,
      itemCode,
      rate,
      amountTotalCents: typeof session.amount_total === "number" ? session.amount_total : null,
      currency,
      tags: [...PURCHASE_TAGS],
      remarks,
      poNo: stripeSessionId
    }
  };
}

export function decideFulfillment(existing: ExistingSalesOrder | null): FulfillDecision {
  if (!existing?.name) return { action: "create" };
  if (existing.docstatus === 0) return { action: "submit_existing", salesOrder: existing.name };
  return { action: "duplicate", salesOrder: existing.name };
}

export function isDryRun(env: { ERP_DRY_RUN?: string; PURCHASE_DRY_RUN?: string }): boolean {
  const value = (env.ERP_DRY_RUN || env.PURCHASE_DRY_RUN || "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}
