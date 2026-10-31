import assert from "node:assert/strict";
import { describe, it } from "node:test";
import worker from "./index.ts";
import { GOB_SALE_TERMS, SHOPIFY_PRODUCT_URL } from "./sale.ts";

const env = {
  ASSETS: { fetch: async () => new Response(null, { status: 404 }) }
};

async function page(path: string): Promise<string> {
  const response = await worker.fetch(new Request(`https://hcgamerlife.org${path}`), env);
  assert.equal(response.status, 200, path);
  return response.text();
}

const forbidden = [/2-year/i, /two-year/i, /two year/i, /no-questions/i, /no questions asked/i];

describe("going-out-of-business sale copy", () => {
  it("states the live sale terms on the homepage, quiz, terms, and privacy pages", async () => {
    const home = await page("/");
    const quiz = await page("/quiz");
    const terms = await page("/terms");
    const privacy = await page("/privacy-policy");
    const privacyAlias = await page("/privacy");
    const journal = await page("/journal/first-gaming-headset-gift-guide");

    for (const html of [home, quiz, terms, privacy, privacyAlias, journal]) {
      for (const pattern of forbidden) {
        assert.doesNotMatch(html, pattern);
      }
    }

    assert.match(home, new RegExp(GOB_SALE_TERMS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(home, /There is no fixed end date/);
    assert.match(home, /\$129\.99/);
    assert.match(home, /53mm/);
    assert.match(home, /Wired 3\.5mm/);
    assert.match(home, /Detachable boom/);
    assert.match(home, /1037 NE 65th St #80853/);
    assert.match(terms, /Sold without warranty/);
    assert.match(terms, /30-day returns/);
    assert.match(terms, /within 90 days/);
    assert.match(terms, /\$12 flat/);
    assert.match(terms, /continental United States only/);
    assert.match(privacy, /30-day returns/);
    assert.match(privacy, /defective units within 90 days/);
    assert.match(privacy, /1037 NE 65th St #80853/);
    assert.match(quiz, /\$40 while supplies last/);
    assert.match(home, new RegExp(SHOPIFY_PRODUCT_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(home, /Buy the HCG1 Pro/);
    assert.match(quiz, /Buy the HCG1 Pro/);
    assert.match(quiz, /gaming-headset-xbox-one-ps4-pc-mobile-compatible/);
    assert.doesNotMatch(home, /js\.stripe\.com/);
    assert.doesNotMatch(home, /stripe-checkout-form/);
    assert.doesNotMatch(home, /api\.stripe\.com/);
  });

  it("redirects /checkout to Shopify and does not open a Stripe session", async () => {
    const stripeEnv = {
      ...env,
      STRIPE_SECRET_KEY: "sk_live_should_not_be_used",
      STRIPE_PRICE_ID: "price_old_12999",
      STRIPE_PUBLISHABLE_KEY: "pk_live_should_not_be_used"
    };
    for (const method of ["GET", "POST", "HEAD"] as const) {
      const response = await worker.fetch(
        new Request("https://hcgamerlife.org/checkout", {
          method,
          body: method === "POST" ? "product=hcg1&quantity=2" : undefined,
          headers: method === "POST" ? { "content-type": "application/x-www-form-urlencoded", accept: "application/json" } : {}
        }),
        stripeEnv
      );
      assert.equal(response.status, 302, method);
      assert.equal(response.headers.get("location"), SHOPIFY_PRODUCT_URL);
      const body = await response.text();
      assert.equal(body.includes("client_secret"), false);
      assert.equal(body.includes("price_old_12999"), false);
    }

    const config = await worker.fetch(new Request("https://hcgamerlife.org/checkout/config"), stripeEnv);
    assert.equal(config.status, 200);
    const payload = await config.json() as { ready?: boolean; checkout?: string; url?: string; publishableKey?: string };
    assert.equal(payload.ready, false);
    assert.equal(payload.checkout, "shopify");
    assert.equal(payload.url, SHOPIFY_PRODUCT_URL);
    assert.equal(payload.publishableKey, undefined);
  });
});
