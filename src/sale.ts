import { HCG1_COMPARE_AT_RATE } from "./purchase/map.ts";

export const BUSINESS_ADDRESS = "1037 NE 65th St #80853, Seattle, WA 98115";
export const SUPPORT_EMAIL = "support@hcgamerlife.com";
export const CONTACT_EMAIL = "dennis@hcgamerlife.com";

function usd(amount: number): string {
  const fixed = amount.toFixed(2);
  return `$${fixed.endsWith(".00") ? fixed.slice(0, -3) : fixed}`;
}

/** Regular Shopify list price. Black Friday discounts are checkout codes, not a lower Offer price. */
export const REGULAR_PRICE_LABEL = usd(HCG1_COMPARE_AT_RATE);
/** JSON-LD Offer price. The list price, because BF60 and BF70 are entered at Shopify checkout. */
export const OFFER_PRICE = HCG1_COMPARE_AT_RATE.toFixed(2);

export const BF60_CODE = "BF60";
export const BF70_CODE = "BF70";
export const BF_ENDS_LABEL = "Nov 30, 2026";
export const SHOP_CTA_LABEL = "Shop Black Friday";

export const BF60_OFFER = `60% off with code ${BF60_CODE} (about $52)`;
export const BF70_OFFER = `70% off orders of 5 or more with code ${BF70_CODE} (about $39 each)`;

/** Customer-facing sale sentence. Matches hcgamerlife.com as of Nov 15, 2026, with the code end year stated. */
export const GOB_SALE_TERMS = `Going-out-of-business sale: Regular price ${REGULAR_PRICE_LABEL}. Black Friday: ${BF60_OFFER}. ${BF70_OFFER}. Enter the code at Shopify checkout. Codes end ${BF_ENDS_LABEL}. Final stock. We are not restocking. Sold without warranty. 30-day returns (buyer pays return shipping unless the unit is defective). Defective units replaced within 90 days. Free shipping, continental US only.`;

export const FAQ_PRICE_QUESTION = "How does the Black Friday price work?";
export const FAQ_PRICE_ANSWER = `The regular price is ${REGULAR_PRICE_LABEL}. Black Friday: ${BF60_OFFER}. ${BF70_OFFER}. Enter the code at Shopify checkout. Codes end ${BF_ENDS_LABEL}. This is final stock. We are not restocking.`;

export const FAQ_SUPPORT_ANSWER = `${GOB_SALE_TERMS} The HCG1 and the HCG1 Pro are the same headset.`;

export const HOME_META_DESCRIPTION = `HCG1 Pro Black Friday: code ${BF60_CODE} is 60% off (about $52). Code ${BF70_CODE} is 70% off on orders of 5 or more (about $39 each). Regular price ${REGULAR_PRICE_LABEL}. Codes end ${BF_ENDS_LABEL}. Final stock.`;

export const QUIZ_META_DESCRIPTION = `Gamer Audio Profile quiz, then the HCG1 Pro. Regular price ${REGULAR_PRICE_LABEL}. Code ${BF60_CODE} is 60% off (about $52). Code ${BF70_CODE} is 70% off on orders of 5 or more (about $39 each). Codes end ${BF_ENDS_LABEL}.`;

export const QUIZ_LEDE = `Four taps. Your Gamer Audio Profile. Then the HCG1 Pro — wired, universal. Black Friday: ${BF60_OFFER}. ${BF70_OFFER}. Codes end ${BF_ENDS_LABEL}.`;

export const QUIZ_RESULT_OFFER = `This is final stock. Regular price ${REGULAR_PRICE_LABEL}. Black Friday: ${BF60_OFFER}. ${BF70_OFFER}. Enter the code at Shopify checkout. Codes end ${BF_ENDS_LABEL}.`;

/** First-impression bar. Black Friday leads; going-out-of-business stays in offer terms and FAQ. */
export const HOLIDAY_TOPLINE = `<strong>BLACK FRIDAY</strong> ${BF60_CODE} 60% off (about $52) · ${BF70_CODE} 70% off on 5+ (about $39 each) · regular ${REGULAR_PRICE_LABEL} · in stock now · final stock, no restock · free shipping, continental US · codes end ${BF_ENDS_LABEL}`;

/** Live Shopify product. Listed at the regular price; Black Friday codes are entered at checkout. */
export const SHOPIFY_PRODUCT_URL =
  "https://www.hcgamerlife.com/products/gaming-headset-xbox-one-ps4-pc-mobile-compatible";

/** Matches the campaign tag HCGL Growth uses in email and partner links. */
export const GROWTH_CAMPAIGN = "gob-bf-2026";

const CHANNEL_MEDIUM: Record<string, string> = {
  slickdeals: "deal-site",
  dealnews: "deal-site",
  retailmenot: "coupon-site",
  dealspotr: "coupon-site",
  knoji: "coupon-site",
  couponbirds: "coupon-site",
  honey: "coupon-site",
  wethrift: "coupon-site",
  reddit: "social",
  facebook: "social",
  discord: "community",
  google: "shopping",
  ebay: "marketplace",
  coach: "outreach",
  club: "outreach",
  press: "pr",
  email: "email",
  newsletter: "newsletter",
  lettergrowth: "newsletter",
  gleam: "giveaway",
  branduo: "partner",
  "hcgamerlife-org": "website"
};

/** Tracked short link: /go/<channel>[?c=<content>] sends the shopper to Shopify with UTMs. */
export function trackedShopifyUrl(channel: string, content?: string | null): string | null {
  const source = channel.toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(source)) return null;
  const medium = CHANNEL_MEDIUM[source] ?? (source.startsWith("creator-") ? "creator" : "referral");
  const url = new URL(SHOPIFY_PRODUCT_URL);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", GROWTH_CAMPAIGN);
  const cleanContent = content?.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
  if (cleanContent) url.searchParams.set("utm_content", cleanContent);
  return url.toString();
}

/** Buy buttons on hcgamerlife.org. Checkout is Shopify; this site has no cart. */
export const ORG_HOME_CHECKOUT_URL = trackedShopifyUrl("hcgamerlife-org", "home")!;
export const ORG_QUIZ_CHECKOUT_URL = trackedShopifyUrl("hcgamerlife-org", "quiz")!;

export function shopifyCheckoutRedirect(): Response {
  return new Response(null, {
    status: 302,
    headers: {
      location: SHOPIFY_PRODUCT_URL,
      "cache-control": "no-store",
      "referrer-policy": "strict-origin-when-cross-origin"
    }
  });
}
