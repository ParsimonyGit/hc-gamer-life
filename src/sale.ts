import { HCG1_COMPARE_AT_RATE, HCG1_SHIPPING_CENTS, HCG1_UNIT_RATE } from "./purchase/map.ts";

export const BUSINESS_ADDRESS = "1037 NE 65th St #80853, Seattle, WA 98115";
export const SUPPORT_EMAIL = "support@hcgamerlife.com";
export const CONTACT_EMAIL = "dennis@hcgamerlife.com";

function usd(amount: number): string {
  const fixed = amount.toFixed(2);
  return `$${fixed.endsWith(".00") ? fixed.slice(0, -3) : fixed}`;
}

export const SALE_PRICE_LABEL = usd(HCG1_UNIT_RATE);
export const COMPARE_AT_LABEL = usd(HCG1_COMPARE_AT_RATE);
export const SHIPPING_LABEL = usd(HCG1_SHIPPING_CENTS / 100);

/** Customer-facing sale sentence. Matches the live hcgamerlife.com product description. */
export const GOB_SALE_TERMS = `Going-out-of-business sale: ${SALE_PRICE_LABEL} while supplies last. Sold without warranty. 30-day returns (buyer pays return shipping unless the unit is defective). Defective units replaced within 90 days. ${SHIPPING_LABEL} flat shipping, continental US only.`;

/** Shopify product already priced at $40. hcgamerlife.org checkout sends buyers here. */
export const SHOPIFY_PRODUCT_URL =
  "https://www.hcgamerlife.com/products/gaming-headset-xbox-one-ps4-pc-mobile-compatible";

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
