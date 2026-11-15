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

export const QUIZ_RESULT_OFFER = `The going-out-of-business sale is final stock. Regular price ${REGULAR_PRICE_LABEL}. Black Friday: ${BF60_OFFER}. ${BF70_OFFER}. Enter the code at Shopify checkout. Codes end ${BF_ENDS_LABEL}.`;

/** Live Shopify product. Listed at the regular price; Black Friday codes are entered at checkout. */
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
