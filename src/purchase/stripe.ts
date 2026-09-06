/** Stripe webhook signature check and Checkout Session retrieval. */

const STRIPE_API = "https://api.stripe.com/v1";
const DEFAULT_TOLERANCE_SEC = 300;

export async function verifyStripeSignature(
  payload: string,
  header: string,
  secret: string,
  nowSec = Math.floor(Date.now() / 1000),
  toleranceSec = DEFAULT_TOLERANCE_SEC
): Promise<boolean> {
  if (!payload || !header || !secret) return false;

  const pairs = header.split(",").map((part) => {
    const index = part.indexOf("=");
    return index === -1 ? ["", ""] : [part.slice(0, index).trim(), part.slice(index + 1).trim()];
  });
  const timestamp = pairs.find(([key]) => key === "t")?.[1];
  const signatures = pairs.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || signatures.length === 0) return false;

  const age = Math.abs(nowSec - Number(timestamp));
  if (!Number.isFinite(Number(timestamp)) || age > toleranceSec) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const digest = [...new Uint8Array(sig)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

  return signatures.some((candidate) => timingSafeEqualHex(digest, candidate));
}

export function timingSafeEqualHex(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i++) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

export async function retrieveCheckoutSession(
  secretKey: string,
  sessionId: string
): Promise<Record<string, unknown>> {
  const url = new URL(`${STRIPE_API}/checkout/sessions/${encodeURIComponent(sessionId)}`);
  url.searchParams.append("expand[]", "line_items");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${secretKey}`,
      "stripe-version": "2024-09-30.acacia"
    }
  });
  const data = (await response.json()) as Record<string, unknown>;
  if (!response.ok) {
    const error = data.error as { message?: string } | undefined;
    throw new Error(error?.message || `Stripe session retrieve failed (${response.status})`);
  }
  return data;
}

export async function signStripePayload(
  payload: string,
  secret: string,
  timestamp: number
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const digest = [...new Uint8Array(sig)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `t=${timestamp},v1=${digest}`;
}
