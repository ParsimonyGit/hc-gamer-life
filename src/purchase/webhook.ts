import { fulfillCheckoutSession, type PurchaseEnv } from "./fulfill.ts";
import {
  isDryRun,
  mapCheckoutSession,
  shouldFulfillCheckoutEvent,
  type StripeCheckoutSession
} from "./map.ts";
import { retrieveCheckoutSession, verifyStripeSignature } from "./stripe.ts";
import { erpConfigured, erpItemCode, erpItemRate } from "./erp.ts";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store"
    }
  });
}

function needsSessionRefresh(session: StripeCheckoutSession): boolean {
  const mapped = mapCheckoutSession(session);
  if (!mapped.ok && /email/i.test(mapped.error)) return true;
  if (!session.line_items?.data?.length && !session.metadata?.quantity) return true;
  return false;
}

export async function handleStripeWebhook(request: Request, env: PurchaseEnv): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  const secret = env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return json({ ok: false, error: "STRIPE_WEBHOOK_SECRET is not set." }, 503);
  }

  const payload = await request.text();
  const header = request.headers.get("stripe-signature") || "";
  if (!(await verifyStripeSignature(payload, header, secret))) {
    return json({ ok: false, error: "Invalid Stripe signature." }, 400);
  }

  let event: { type?: string; id?: string; data?: { object?: StripeCheckoutSession } };
  try {
    event = JSON.parse(payload) as typeof event;
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const type = event.type || "";
  let session = event.data?.object || {};
  const gate = shouldFulfillCheckoutEvent(type, session);
  if (!gate.fulfill) {
    return json({ ok: true, ignored: true, reason: gate.reason, type });
  }

  if (needsSessionRefresh(session) && env.STRIPE_SECRET_KEY?.trim() && session.id) {
    try {
      const fresh = (await retrieveCheckoutSession(env.STRIPE_SECRET_KEY.trim(), session.id)) as StripeCheckoutSession;
      session = { ...session, ...fresh };
    } catch (error) {
      console.warn(
        JSON.stringify({
          msg: "stripe_session_refresh_failed",
          session: session.id,
          error: error instanceof Error ? error.message : "unknown"
        })
      );
    }
  }

  try {
    const result = await fulfillCheckoutSession(env, session);
    console.log(
      JSON.stringify({
        msg: "hcgl_purchase_fulfilled",
        event: event.id,
        type,
        dryRun: Boolean(result.dryRun),
        duplicate: Boolean(result.duplicate),
        salesOrder: result.salesOrder || null,
        customer: result.customer || null,
        ghlContactId: result.ghlContactId || null
      })
    );
    return json({
      ok: true,
      type,
      dryRun: result.dryRun || false,
      duplicate: result.duplicate || false,
      submitted: result.submitted || false,
      salesOrder: result.salesOrder || null,
      customer: result.customer || null,
      ghlContactId: result.ghlContactId || null,
      ghlSkipped: result.ghlSkipped || false,
      email: result.plan.email,
      quantity: result.plan.quantity,
      itemCode: result.plan.itemCode
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fulfillment failed";
    const mapped = mapCheckoutSession(session, {
      itemCode: erpItemCode(env),
      rate: erpItemRate(env)
    });
    const missingErp = /ERP is not configured/i.test(message);
    if (missingErp && isDryRun(env)) {
      return json({ ok: true, dryRun: true, type, plan: mapped.ok ? mapped.plan : null });
    }
    console.error(
      JSON.stringify({
        msg: "hcgl_purchase_failed",
        event: event.id,
        type,
        configured: erpConfigured(env),
        error: message
      })
    );
    return json({ ok: false, error: message, type }, missingErp ? 503 : 500);
  }
}
