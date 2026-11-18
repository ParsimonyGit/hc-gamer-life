# HCG1 checkout and funnel audit

- **Agent:** HCGL Growth
- **Date:** Nov 18, 2026 (America/Chicago)
- **Store:** hc-gamerlife, Shopify Basic (not Plus)
- **Numbers:** ShopifyQL `FROM sessions` and `FROM sales`, read Nov 18, 2026, about 11:40 AM CT, through the Shopify connector. The store's analytics day boundary is Pacific.
- **Source:** the Nov 18 checkout audit. Queries are listed at the end.

This file records the morning measurement and the checkout changes made later the same day. It does not change the theme, the policies, or `src/`.

## 1. Figures Dennis had been using

| Claim | Measured | Notes |
|---|---|---|
| 4,276 sessions | 4,346 sessions, last 365 days (Nov 2025 through Nov 18, 2026) | Same ballpark. 4,276 was a 12-month total, not a month. Last 30 days: 307. |
| 0.18% conversion | 0.35% (15 converting sessions / 4,346) over 12 months | Could not reproduce 0.18%. Shopify `sales` shows 16 orders in that window. |
| About 32% of checkouts complete | 38% over 12 months (15 completed / 39 reached checkout). 40% in the last 30 days (6 / 15). | Could not reproduce 32%. The counts are small. One sale moves the rate about 7 points. |

The useful cut is bots. `human_or_bot_session`: 2,897 of 4,346 sessions (67%) over 12 months were flagged bot, and 199 of 307 (65%) in the last 30 days. Bots bought nothing. Take them out and conversion is about 3 times the headline rate.

## 2. Funnel, human sessions

### Last 30 days (Oct 19 – Nov 18)

| Step | All sessions | Human, and viewed the product page |
|---|---|---|
| Sessions | 307 (108 human) | 55 |
| Added to cart | 10 | 10 (18% add-to-cart) |
| Reached checkout | 15 | 9 |
| Completed checkout | 6 | 5 (9.1% of product-page viewers) |
| Conversion | 1.95% all / 5.6% human | — |

Reached-checkout is higher than cart adds because 6 sessions landed directly on a `/checkouts/...` URL (recovery links or direct checkout links) and skipped the cart.

Landing pages, 30 days: Homepage 137 sessions and 0 add-to-carts. Product page 66 sessions, 10 carts, 5 purchases. Blog 38, search 17, custom pages 16, collection 8, all with 0 carts. The homepage was not starting checkouts. The price and the buy button have to be on that first screen. The Trust+Hero theme, published later the same day, is the theme that carries that.

Since Oct 26 (sale start) through the morning read: 263 sessions, 10 carts, 15 reached checkout, 6 completed, 2.28%.

### Last 12 months, human only

- 1,449 human sessions, 15 completed. Conversion 1.04%.
- Human product-page viewers: 230. Then 24 carts (10.4%), 21 reached checkout, 12 completed. That is 5.2% of product viewers.

### By device, human, 12 months

| Device | Sessions | Carts | Reached checkout | Completed | Conversion |
|---|---|---|---|---|---|
| Desktop | 946 | 7 | 6 | 1 | 0.11% |
| Mobile | 493 | 19 | 22 | 14 | 2.84% |
| Tablet / other | 10 | 0 | 0 | 0 | 0 |

Last 30 days, all traffic: desktop 227 sessions and 1 sale. Mobile 75 sessions and 5 sales (6.7%). Buyers are on phones. The desktop rate is likely pulled down by bots the flag did not catch.

### By traffic source, human, 12 months

| Source | Sessions | Completed | Conversion |
|---|---|---|---|
| Direct | 876 | 9 | 1.03% |
| Search | 502 | 4 | 0.80% |
| Unknown | 57 | 0 | 0 |
| Email | 10 | 2 | 20% |
| Social | 4 | 0 | 0 |

hcgamerlife.org was sending people to the .com product page without a UTM, so that traffic most likely sat in direct or unknown. This table is from before tracked links. New outbound uses the Shopify product URL with `utm_campaign=gob-bf-2026` directly. A `/go/` short link still 302s there if one was already used. Do not read this table as the result of those links.

### Suspicious international and bot traffic, 30 days

- US: 193 sessions, and all 6 purchases. Non-US: about 114 sessions (37%), 0 purchases.
- Zero-second average sessions: China 35, Singapore 10, Finland 4, Bangladesh 2.
- The headset rate covered the continental US. Non-US traffic could not buy.

## 3. What the checkout looked like at about 11:35–11:40 AM CT

| Item | Found | Source |
|---|---|---|
| Checkout | Native Shopify checkout (`checkout.shopify`, `/checkouts/cn/...` on hcgamerlife.com). hcgamerlife.org has no checkout. Its buy links go to the .com product page. Recent web orders paid with `shopify_payments`. | curl of the .org home; orders API |
| Guest checkout | Allowed. Customer accounts optional. `loginRequiredAtCheckout: false`. | Admin API `shop.customerAccountsV2`, live checkout `customerAccountRequirement: OPTIONAL` |
| Fields at that hour | First name required. Company optional and shown. Address line 2 optional and shown. Shipping phone required. Billing phone optional. | Live checkout config |
| Wallets | Shop Pay, Apple Pay, Google Pay, and PayPal Express on. `paymentSettings.supportedDigitalWallets`: SHOP_PAY, APPLE_PAY, GOOGLE_PAY. | Admin API and live checkout |
| Shipping rate | Headset and mic in profile "Calculated Rates including CA & all of US territories", zone "Continental US (GOB sale)" (48 states and DC), one $0 rate. No rate then for AK, HI, PR, or Canada, while the store still listed Canada and the US as ship-to countries. Those buyers could reach "no shipping available." | deliveryProfiles API |
| Cart drawer | Showed "Taxes and shipping calculated at checkout." That hid free shipping. | Published theme snapshot, that morning |
| Policy links | Refund, shipping, privacy, and terms linked in the checkout footer. Policies last edited Nov 16, as of this read. | Live checkout |
| Abandoned email | On since Nov 4 (Shopify Messaging: abandoned checkout, cart, and browse). Dennis approved Nov 3. Flow waits of 1h / 2h / 4h approved Nov 5 and marked complete in ERP 00086. Messaging and Flow are not exposed to the connector, so that ERP mark was not re-checked via API. | post-launch task log |
| Abandoned checkouts with an email, 30 days | 2. Both were a $24.99 charging stand, Nov 5. Headset abandoners had not typed an email, so a recovery email cannot reach them. | `abandonedCheckouts` API |
| SMS recovery | Consent checkbox on at checkout, unchecked by default. Shopify Messaging SMS is paid per message and was not set up. | shop API |
| Delivery actually seen | IWS: first carrier scan the same day or the next business day (weekend orders scanned Monday). Delivered: Idaho 1 day, California 2 days, Tennessee and Michigan 8 days (Nov 2 to Nov 10), Texas via FedEx about 4 days. One Texas order still "out for delivery" since Nov 2. A "1–3 day" delivery line is not supported. Do not publish one. | orders and fulfillments API |

## 4. What changed on Nov 18

The morning audit changed one thing itself. The rest of this list was done later the same day, after that ShopifyQL pull.

1. **Shipping phone set to optional at checkout.** At about 11:35 AM CT the live checkout still required it, and the API could not change it. A required phone is a known reason people leave an about-$52 checkout. It was set to optional later on Nov 18.
2. **Canada market drafted.** Drafted, not a live ship-to with a rate. At audit time a Canada address could reach checkout and then get no rate. AK, HI, and PR still had no headset rate in the morning read.
3. **Free rate renamed** to `Free shipping (continental US) – ships from Idaho`. Profile 77956481095, method 946276696135. Price stayed $0. Zone and conditions stayed. The morning audit's backup path: `backups/checkout-2026-11-18/delivery-profile-77956481095-before.json`. Revert would be renaming it back. This is the change the audit made.
4. **Policies rewritten to the no-warranty terms.** Sold without warranty. 30-day returns (buyer pays return shipping unless the unit is defective, damaged, or wrong). Defective units replaced within 90 days. The morning read still saw a Nov 16 edit timestamp. The rewrite is later on Nov 18.
5. **Theme HC GamerLife Trust+Hero 2026-11-18 published.** Theme `gid://shopify/OnlineStoreTheme/161914454087`, recorded as the live theme in `docs/agents/hcgamerlife-org/2026-11-18-holiday-traffic.md`. This PR does not publish it again.

Guest checkout, the company field, address line 2, and the wallets were already in the state above. No second change was made to those.

## 5. Copy still worth pasting

Not applied by this file. On Basic, custom blocks on the information, shipping, and payment steps are a Plus feature. The reliable places are the product page, the cart, and checkout language or footer where Basic allows it. Thank-you and order-status pages can take app blocks.

**Cart drawer**, in place of "Taxes and shipping calculated at checkout.":

> Free shipping to the continental US (48 states and DC). Ships from Idaho, usually within 1–2 business days. Taxes calculated at checkout.

**Near the buy button:**

> Free continental US shipping. Ships from Idaho, usually within 1–2 business days.

**Reassurance, now that the policies match:**

> Sold without warranty. 30-day returns (buyer pays return shipping unless the unit is defective, damaged, or wrong). Defective units replaced within 90 days. Questions: support@hcgamerlife.com

The cable is permanently attached, about 3 ft. A removable PC splitter extends it to about 6 ft. Do not describe the cable as something the buyer unplugs from the headset.

Recovery-email words for welcome, abandoned checkout, abandoned cart, and browse are in `2026-11-18-outbound-send-plan.md`. The morning audit left those automations on. The words in them were still the retired lines.

## 6. Still Dennis, in the admin

1. Confirm the shipping phone now shows Optional. https://admin.shopify.com/store/hc-gamerlife/settings/checkout
2. Company name can be set to Don't include. Small win. Same page.
3. Confirm the abandoned-checkout automation is still on, and paste the replacement copy from the send plan. https://admin.shopify.com/store/hc-gamerlife/marketing/automations and Flow at https://admin.shopify.com/store/hc-gamerlife/apps/flow
4. Canada is drafted. AK, HI, and PR still need a decision: a paid rate, or stay unbuyable. Do not leave a path that ends at "no shipping available" if the market is turned on.
5. Paste the cart and product lines above only through the theme owner. This agent does not edit the theme.
6. Google Shopping ads are paid. Nothing is set up. That needs a budget yes.

## 7. What to test

There is one checkout: native Shopify. The .org site is a landing page. The test that matters is the path.

- A: .org landing, then the .com product page.
- B: .com product page directly.
- C, later: a cart permalink that skips the product page.

New buyer links are the Shopify product URL with `utm_source`, `utm_medium`, and `utm_campaign=gob-bf-2026`. Read those weekly:

```
FROM sessions
  SHOW sessions, sessions_with_cart_additions, sessions_that_reached_checkout,
       sessions_that_completed_checkout, conversion_rate
  WHERE human_or_bot_session = 'human'
  GROUP BY utm_source, utm_content
  SINCE -14d UNTIL today
```

Traffic is about 3–4 human sessions a day. Under about 30 checkouts per arm, treat the result as a hint.

## 8. Weekly report

Human sessions only. Attach it to the daily sales routine if that is easier than a new one.

```
FROM sessions
  SHOW sessions, sessions_with_cart_additions, sessions_that_reached_checkout,
       sessions_that_completed_checkout, added_to_cart_rate, checkout_conversion_rate, conversion_rate
  WHERE human_or_bot_session = 'human'
  GROUP BY landing_page_type, session_device_type
  SINCE -7d UNTIL today
```

Also `GROUP BY referrer_source` and `GROUP BY session_country`. Report homepage sessions, product-page sessions (`session_viewed_product = true`), add-to-cart rate, checkout reached, checkout completion, device, source, and bot share.

Save it in Admin → Analytics → Reports → New exploration, or run it from the routine. Judge milestones on human conversion. At this read that was about 1.0% over 12 months and 5.6% over 30 days. Bots will distort the other number.

## 9. Queries used

- `FROM sessions SHOW sessions, sessions_with_cart_additions, sessions_that_reached_checkout, sessions_that_completed_checkout, conversion_rate SINCE -30d UNTIL today`
- The same, `TIMESERIES month SINCE -365d UNTIL today WITH TOTALS`
- The same, `SINCE 2026-10-26 UNTIL today`
- The same, `GROUP BY session_viewed_product, human_or_bot_session` (30 days and 365 days)
- The same, `GROUP BY session_device_type` and `GROUP BY referrer_source`, `WHERE human_or_bot_session = 'human'` (365 days); `GROUP BY session_device_type` (30 days)
- `GROUP BY session_country`, `GROUP BY landing_page_path`, `GROUP BY landing_page_type`
- `SHOW sessions, bounce_rate, average_session_duration, pageviews GROUP BY session_country` (30 days)
- `FROM sales SHOW orders, gross_sales, net_sales TIMESERIES month SINCE -365d UNTIL today WITH TOTALS`

Caveat: reading the live checkout config loaded one checkout by curl at about 11:35 AM CT on Nov 18. No purchase. It may have added one bot or abandoned session to that day's stats.
