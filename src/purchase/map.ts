/** Pure Stripe Checkout → ERP/GHL purchase mapping. No I/O. */

export const DEFAULT_ERP_URL = "https://admin.hcgamerlife.org";
export const HCG1_ITEM_CODE = "HCG1-PRO";
/** Current going-out-of-business selling price in USD. The former price ($129.99) is compare-at only. */
export const HCG1_UNIT_RATE = 40;
export const HCG1_UNIT_CENTS = 4000;
/** Former / compare-at price in USD. Not the amount Checkout or the Sales Order should charge. */
export const HCG1_COMPARE_AT_RATE = 129.99;
/** Flat shipping in cents. Continental US only; Stripe country allowlists cannot exclude AK/HI. */
export const HCG1_SHIPPING_CENTS = 1200;
export const CHECKOUT_SHIPPING_LABEL = "Flat rate (continental US)";
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
    `item=${itemCode} qty=${quantity} rate=${rate.toFixed(2)}`,
    "sale=going-out-of-business",
    `shipping_flat_usd=${(HCG1_SHIPPING_CENTS / 100).toFixed(2)} continental_us`
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

/**
 * Price and shipping fields for embedded Checkout.
 * TODO(ops): `priceId` must be a Stripe Price for USD 40.00 in the same mode as
 * STRIPE_SECRET_KEY. The Worker does not create Prices and must not hardcode a
 * Price ID. Until STRIPE_PRICE_ID is that $40 Price, Checkout still charges
 * whatever Price is stored (previously the $129.99 selling price).
 * Shipping uses inline shipping_rate_data ($12) so no Shipping Rate ID is required.
 */
export function applySaleCheckoutFields(params: URLSearchParams, priceId: string, quantity: number): void {
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", String(quantity));
  params.set("shipping_address_collection[allowed_countries][0]", "US");
  params.set("shipping_options[0][shipping_rate_data][display_name]", CHECKOUT_SHIPPING_LABEL);
  params.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(HCG1_SHIPPING_CENTS));
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "usd");
}

export function isDryRun(env: { ERP_DRY_RUN?: string; PURCHASE_DRY_RUN?: string }): boolean {
  const value = (env.ERP_DRY_RUN || env.PURCHASE_DRY_RUN || "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}
