# Proposal: holiday traffic for BF60/BF70

- **Agent:** hcgamerlife.org
- **Date:** Nov 18, 2026 (America/Chicago)
- **Status:** proposed. Nothing in section 3 has been sent, posted, or submitted.
- **Does not merge storefront code.** Tracked links and `#squads` are in [PR #17](https://github.com/ParsimonyGit/hc-gamer-life/pull/17). Copy to send is in [2026-11-18-copy-kit.md](2026-11-18-copy-kit.md).

## 1. Why

The offer is live on Shopify (codes BF60 and BF70, both ACTIVE, HCG1 Pro only, end 2026-12-01 05:59 UTC). The Worker storefront still needs holiday visitors. No upfront ad spend. CPA (Collabs, Amazon) is allowed. Free channels first.

## 2. Already true (do not redo)

| Item | Where |
|---|---|
| BF60 60% off the HCG1 Pro, no minimum | Shopify discount `gid://shopify/DiscountCodeNode/1516953206855` |
| BF70 70% off, minimum quantity 5 | Shopify discount `gid://shopify/DiscountCodeNode/1516953239623` |
| Product list price $129.99, inventory 1,291 | Shopify product `gid://shopify/Product/1297442340935` |
| Checkout URL | `https://www.hcgamerlife.com/products/gaming-headset-xbox-one-ps4-pc-mobile-compatible` |
| Live Shopify theme | **HC GamerLife Trust+Hero 2026-11-18** (`gid://shopify/OnlineStoreTheme/161914454087`, role MAIN) |
| Org sales pitch + `/go/<channel>` + `#squads` | PR #17, merged and live |
| GOB demotion on hcgamerlife.org | PR #20, merged and live |

The published Shopify theme already states: Black Friday BF60/BF70, free continental US shipping, ships from Idaho in 1–2 business days, sold without warranty. Homepage CTA is **Buy HCG1**. One homepage rich-text block still says "while supplies last"; that phrase is banned on hcgamerlife.org.

## 3. Proposed channels (priority order)

All ⛔ items need a yes on this PR before anyone sends or submits.

### A. Shopify Email to the ~710 subscribers and opted-in quiz contacts — ⛔ each send

**HCGL Growth sends Email 3** (Dennis assigned this Nov 18). Paste into Shopify Email. Do not send the Gmail drafts to the list. Do **not** send Email 1 (it reruns the Oct 31 $40 closeout). Assignment: [PR #21](https://github.com/ParsimonyGit/hc-gamer-life/pull/21).

1. Email 3 now: free shipping + Amazon reviews (new CTA).
2. Last-call email the morning of Monday, Nov 30, 2026 (America/Chicago).

### B. Coupon and deal-code listings — ⛔ submit

RetailMeNot, CouponBirds, Dealspotr, Knoji, WeThrift. Public codes only. Destination is the Shopify product URL with UTMs (hcgamerlife.com). Do not send coupon traffic to hcgamerlife.org; that site has no cart. `/go/<site>` still 302s if a short link is needed.

Honey: email `deals@joinhoney.com` from `dennis@hcgamerlife.com`.

Do **not** self-post on Slickdeals. Merchant/employee self-posts are against their rules.

### C. Reddit, with disclosure — ⛔ each sub

Only in subs whose rules allow vendors. First comment discloses "I work with HC GamerLife."

### D. Google free listings — ⛔ Shopify admin

Install/connect Google & YouTube, enable free listings for the HCG1 Pro, add a Merchant Center promotion for BF60 ending 2026-11-30. The Admin API on this store did not expose a Google channel this agent could turn on.

### E. Shopify Collabs, 15% CPA — ⛔ commission rate

Small PC/console/budget-gear creators. Sample unit plus 15% on tracked sales. Sale units have no warranty; creators must not claim one. Proposed landing after PR #17: `/creators`.

### F. Coaches, clubs, LAN nights, youth groups — ⛔ each send

BF70, 5 or more, about $39 each. Proposed landing after PR #17: `/squads` and `/go/coach?c=bf70`.

### G. Amazon ASIN B07BHYZFLF — ⛔ Seller Central

Listing is "Currently unavailable" and still shows 4.2★ from 485 ratings (Nov 18, 2026). Reactivate in Seller Central. Shopify codes do not apply on Amazon; either price at the BF60 cash amount or leave $129.99 and point shoppers to Shopify.

## 4. Tracking

Campaign tag, shared with HCGL Growth: `utm_campaign=gob-bf-2026`.

Published destinations: `https://www.hcgamerlife.com/products/gaming-headset-xbox-one-ps4-pc-mobile-compatible` plus `utm_source`, `utm_medium`, and that campaign. `/go/<channel>?c=<content>` still 302s there. Do not land buyers on hcgamerlife.org.

Measure daily in Shopify: sessions by `utm_campaign=gob-bf-2026`, orders using BF60 vs BF70, units per order. Recompute any units/day target; Growth's 54/day figure was for the retired $40 price. Do not publish a unit count until the IWS 1,300 vs 1,530 question is closed.

## 5. Site follow-ups (not in this PR)

Uncommitted Worker work exists on `cursor/hcg1-sales-pitch-b974` (stash: "wip landings and GOB demotion"): `/deal`, `/squads`, `/creators` pages, holiday topline that leads with Black Friday, and "In stock. Ships from the US." That stays off this proposal PR so the docs can merge without storefront code.

## 6. Out of scope until a separate PR

- Editing the live Shopify theme (theme_commit refuses MAIN; a follow-up would duplicate, edit, then ask to publish).
- Sending any customer email.
- Posting on Reddit or Slickdeals.
- Submitting coupon forms.
- Changing Amazon.
