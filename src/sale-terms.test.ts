import assert from "node:assert/strict";
import { describe, it } from "node:test";
import worker from "./index.ts";
import { AMAZON_EXCERPTS, AMAZON_LISTING_URL, NAMED_REVIEWS } from "./proof.ts";
import { BANDS } from "./quiz/data.ts";
import { GOB_SALE_TERMS, HOME_META_DESCRIPTION, OFFER_PRICE, QUIZ_META_DESCRIPTION, SHOP_CTA_LABEL, SHOPIFY_PRODUCT_URL } from "./sale.ts";

const env = {
  ASSETS: { fetch: async () => new Response(null, { status: 404 }) }
};

async function page(path: string): Promise<string> {
  const response = await worker.fetch(new Request(`https://hcgamerlife.org${path}`), env);
  assert.equal(response.status, 200, path);
  return response.text();
}

const forbidden = [/2-year/i, /two-year/i, /two year/i, /no-questions/i, /no questions asked/i];
const retiredPriceClaim = "$" + "40";

function assertNoRetiredPrice(text: string): void {
  assert.equal(text.includes(retiredPriceClaim), false);
}

describe("Black Friday going-out-of-business sale copy", () => {
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
      assertNoRetiredPrice(html);
      assert.doesNotMatch(html, /no fixed end date/i);
      assert.doesNotMatch(html, /while supplies last/i);
    }

    assert.match(GOB_SALE_TERMS, /Regular price \$129\.99/);
    assert.match(GOB_SALE_TERMS, /60% off with code BF60 \(about \$52\)/);
    assert.match(GOB_SALE_TERMS, /70% off orders of 5 or more with code BF70 \(about \$39 each\)/);
    assert.match(GOB_SALE_TERMS, /Enter the code at Shopify checkout/);
    assert.match(GOB_SALE_TERMS, /Codes end Nov 30, 2026/);
    assert.match(GOB_SALE_TERMS, /Final stock\. We are not restocking/);
    assert.match(GOB_SALE_TERMS, /Sold without warranty/);
    assertNoRetiredPrice(GOB_SALE_TERMS);
    assert.equal(OFFER_PRICE, "129.99");

    assert.match(home, new RegExp(GOB_SALE_TERMS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(home, /\$129\.99/);
    assert.match(home, /free shipping, continental US/);
    assert.match(home, /We are not restocking/);
    assert.match(home, new RegExp(HOME_META_DESCRIPTION.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(home, /property="og:description" content="[^"]*BF60/);
    assert.match(home, /name="twitter:description" content="[^"]*BF70/);
    assert.doesNotMatch(home, /countdown|ends tonight|ends today|hours left|days left/i);

    const aboveGallery = home.slice(0, home.indexOf('id="gallery"'));
    assert.match(aboveGallery, /Black Friday · in stock now/);
    assert.doesNotMatch(aboveGallery, /going out of business/i);
    assert.match(home, /Going-out-of-business sale:/);
    assert.match(home, /How is it supported\?/);
    assert.match(aboveGallery, /Now is the<br \/><span>best time\.<\/span>/);
    assert.match(aboveGallery, /53mm drivers, a detachable mic/);
    assert.match(aboveGallery, /Regular price \$129\.99/);
    assert.match(aboveGallery, /BF60<\/strong><span>60% off · about \$52/);
    assert.match(aboveGallery, /BF70<\/strong><span>70% off on 5 or more · about \$39 each/);
    assert.match(aboveGallery, /Enter the code at Shopify checkout/);
    assert.match(aboveGallery, /Codes end Nov 30, 2026/);
    assert.match(aboveGallery, /Free shipping<\/strong><span>Continental US/);
    assert.match(aboveGallery, /Final stock<\/strong><span>We are not restocking/);
    assert.match(aboveGallery, /Sold without warranty/);
    assert.match(aboveGallery, /30-day returns \(you pay return shipping unless the unit is defective\)/);
    assert.match(aboveGallery, /Defective units replaced within 90 days/);
    const shopifyHref = SHOPIFY_PRODUCT_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(aboveGallery, new RegExp(`href="${shopifyHref}"`));
    const actions = aboveGallery.slice(aboveGallery.indexOf('class="actions"'));
    const buyInActions = actions.indexOf(SHOP_CTA_LABEL);
    const quizInActions = actions.indexOf("Take the quiz");
    assert.ok(buyInActions > 0 && quizInActions > buyInActions, "Shop Black Friday is the first hero action");
    assert.match(terms, /This is final stock\. We are not restocking\./);
    assert.match(terms, /regular price is <strong>\$129\.99<\/strong>/);
    assert.match(terms, /60% off with code BF60 \(about \$52\)/);
    assert.match(terms, /70% off orders of 5 or more with code BF70 \(about \$39 each\)/);
    assert.match(terms, /Codes end Nov 30, 2026/);
    assert.match(home, /How does the Black Friday price work\?/);
    assert.match(home, /Black Friday<\/span><strong>BF60 · 60% off · BF70 on 5\+/);
    assert.match(home, /Shipping<\/span><strong>Free · continental US<\/strong>/);
    assert.match(home, /"price":"129\.99"/);
    assert.doesNotMatch(home, /"price":"40\.00"/);
    assert.match(home, /"shippingRate":\{"@type":"MonetaryAmount","value":"0\.00","currency":"USD"\}/);
    assert.doesNotMatch(home, /\$12(?!\d)/);
    assert.match(home, /53mm/);
    assert.match(home, /Wired 3\.5mm/);
    assert.match(home, /Detachable boom/);
    assert.match(home, /1037 NE 65th St #80853/);
    assert.match(terms, /Sold without warranty/);
    assert.match(terms, /30-day returns/);
    assert.match(terms, /within 90 days/);
    assert.match(terms, /Shipping is <strong>free<\/strong>/);
    assert.doesNotMatch(terms, /\$12(?!\d)/);
    assert.match(terms, /continental United States only/);
    assert.match(privacy, /30-day returns/);
    assert.match(privacy, /defective units within 90 days/);
    assert.match(privacy, /BF60/);
    assert.match(privacy, /1037 NE 65th St #80853/);
    assert.match(quiz, /BF60<\/strong><span>60% off · about \$52/);
    assert.match(quiz, /70% off orders of 5 or more with code BF70 \(about \$39 each\)/);
    assert.match(quiz, /Codes end Nov 30, 2026/);
    assert.match(home, /Black Friday · final stock/);
    assert.doesNotMatch(quiz.slice(0, quiz.indexOf('id="quiz-app"')), /going out of business/i);
    assert.match(quiz, new RegExp(QUIZ_META_DESCRIPTION.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(quiz, /"price":"129\.99"/);
    for (const band of Object.values(BANDS)) {
      const text = `${band.story} ${band.promise.join(" ")}`;
      assert.match(text, /BF60/);
      assert.match(text, /BF70/);
      assert.match(text, /about \$52/);
      assert.match(text, /about \$39 each/);
      assertNoRetiredPrice(text);
      assert.match(quiz, new RegExp(band.story.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
    assert.match(home, new RegExp(shopifyHref));
    assert.equal(home.match(new RegExp(`href="${shopifyHref}">${SHOP_CTA_LABEL}`, "g"))?.length, 6);
    assert.match(quiz, new RegExp(`href="${shopifyHref}">${SHOP_CTA_LABEL}`));
    assert.doesNotMatch(home, /Buy the HCG1 Pro/);
    assert.doesNotMatch(quiz, /Buy the HCG1 Pro/);
    assert.match(quiz, /gaming-headset-xbox-one-ps4-pc-mobile-compatible/);
    assert.doesNotMatch(home, /js\.stripe\.com/);
    assert.doesNotMatch(home, /stripe-checkout-form/);
    assert.doesNotMatch(home, /api\.stripe\.com/);
  });

  it("sells the HCG1 with attributed Amazon reviews and an honest comparison", async () => {
    const home = await page("/");
    const product = home.slice(home.indexOf('id="product"'), home.indexOf('class="manifesto"'));
    assert.match(product, /The complete wired headset for serious game time\./);
    assert.match(product, /About \$52<\/strong> with code BF60/);
    assert.match(product, /4\.2 out of 5<\/strong> from 485 Amazon ratings/);
    assert.match(product, /“Almost all metal\.”<cite>— Craig B\., Amazon review/);
    assert.match(product, /“No sound distortion!!”<cite>— Spencer H\., Amazon review/);
    for (const review of NAMED_REVIEWS) assert.ok(home.includes(review.quote), review.author);
    for (const excerpt of Object.values(AMAZON_EXCERPTS)) assert.ok(home.includes(excerpt));
    assert.ok(home.includes(`href="${AMAZON_LISTING_URL}"`));
    assert.match(home, /id="compare"/);
    assert.match(home, /HyperX includes more connection options and has a larger review base\. Recon 70 usually costs less\./);
    assert.doesNotMatch(home, /better than (HyperX|Turtle Beach)|best headset under|universal compatibility|warranty\/guarantee|two-year support|ships within 24/i);
    assert.doesNotMatch(product + home.slice(home.indexOf('id="compare"'), home.indexOf('id="setup"')), /noise.cancel/i);
    const shopifyHref = SHOPIFY_PRODUCT_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.ok((home.match(new RegExp(`href="${shopifyHref}">${SHOP_CTA_LABEL}`, "g"))?.length ?? 0) >= 5);
  });

  it("sends /go/<channel> links to Shopify with gob-bf-2026 UTMs", async () => {
    const go = async (path: string) => worker.fetch(new Request(`https://hcgamerlife.org${path}`), env);
    const deal = await go("/go/slickdeals?c=bf70");
    assert.equal(deal.status, 302);
    const target = new URL(deal.headers.get("location") ?? "");
    assert.equal(`${target.origin}${target.pathname}`, SHOPIFY_PRODUCT_URL);
    assert.equal(target.searchParams.get("utm_source"), "slickdeals");
    assert.equal(target.searchParams.get("utm_medium"), "deal-site");
    assert.equal(target.searchParams.get("utm_campaign"), "gob-bf-2026");
    assert.equal(target.searchParams.get("utm_content"), "bf70");
    const creator = new URL((await go("/go/creator-sample")).headers.get("location") ?? "");
    assert.equal(creator.searchParams.get("utm_medium"), "creator");
    assert.equal((await go("/go/Bad%20Channel!")).status, 404);
    const home = await page("/");
    assert.match(home, /id="squads"/);
    assert.match(home, /About \$39 each<\/strong> with code BF70/);
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
