# HCGL Growth

- **Agent:** HCGL Growth (marketing and sales for HC GamerLife)
- **Date:** Nov 18, 2026 (America/Chicago)
- **Writes:** this folder only

This agent drafts how to sell the remaining HCG1 Pro units. Dennis decides what actually goes out. Nothing in these files has been sent, posted, or submitted.

Follow [`../ORCHESTRATOR.md`](../ORCHESTRATOR.md). Offer facts also live in [`../README.md`](../README.md). Channel copy to paste lives in [`../hcgamerlife-org/2026-11-18-copy-kit.md`](../hcgamerlife-org/2026-11-18-copy-kit.md). This folder does not edit that kit.

## What this agent owns

Orchestrator row 4, outbound. Copy stays in `docs/agents/`. The send happens outside git, after Dennis says yes:

- Shopify Email
- Coupon-site listings and the Honey email
- Gleam post-entry
- Shopify Collabs
- Reddit
- Coaches and clubs
- Lettergrowth and Branduo
- SMS, only if a compliant list already exists

Orchestrator row 5, with Dennis: Google Merchant Center free listings, and Amazon ASIN B07BHYZFLF. That work follows row 4. It does not replace it, and it is not a Worker change.

## What this agent never does

- Send, post, submit, or turn on an automation without Dennis's explicit yes
- Edit `src/`, workflows, config, or any docs folder except this one
- Edit or publish the Shopify theme
- Create, edit, or recreate discount codes. BF60 and BF70 are already live in Shopify Admin
- Merge this PR. Merging to `main` deploys the Cloudflare Worker

## Offer facts

- Regular price $129.99
- BF60: 60% off, about $52
- BF70: 70% off on 5 or more, about $39 each
- Codes end Nov 30, 2026, 11:59 PM CT
- Free shipping, continental US (48 states and DC)
- Sold without warranty
- 30-day returns. The buyer pays return shipping unless the unit is defective, damaged, or wrong
- Defective units replaced within 90 days
- Final stock. We are not restocking
- Support: support@hcgamerlife.com
- Outbound mail that leaves the building goes from dennis@hcgamerlife.com

Black Friday leads. "Final stock, no restock" belongs in the sale terms, not in the first line.

The cable is permanently attached, about 3 ft. A removable PC splitter extends it to about 6 ft. The microphone comes off. The cable does not.

## Words that do not ship

Do not say "$40", "two-year", "2-year", "guarantee", "no questions", "detachable cable", or "order by". Do not invent reviews. Do not publish a wholesale price. Do not promise a delivery date.

## Links

Use `https://hcgamerlife.org/go/<channel>` from the copy kit. Checked Nov 18, 2026 (America/Chicago): `https://hcgamerlife.org/go/email` returned HTTP 302 to the Shopify HCG1 product with `utm_campaign=gob-bf-2026`. Check the exact link again on the day it is used. PR #17 is on `main`.

## Index

| Date | File | What it is |
|---|---|---|
| 2026-11-18 | [2026-11-18-christmas-sell-through-plan.md](2026-11-18-christmas-sell-through-plan.md) | Ranked ways to move units by Christmas. Internal. Not a send list. |
| 2026-11-18 | [2026-11-18-outbound-send-plan.md](2026-11-18-outbound-send-plan.md) | Sequenced row-4 sends, gates, links, and copy-kit flags. |
| 2026-11-18 | [2026-11-18-checkout-funnel-audit.md](2026-11-18-checkout-funnel-audit.md) | ShopifyQL funnel numbers and the Nov 18 checkout changes. |
| 2026-11-18 | [2026-11-18-value-comparison.md](2026-11-18-value-comparison.md) | Honest value copy. Competitor notes are internal only. |
| 2026-11-17 | [2026-11-17-social-following.md](2026-11-17-social-following.md) | Public follower counts for the DojoMojo application. |

## How to add a file

1. Branch from `main`.
2. Add `docs/agents/hcgl-growth/YYYY-MM-DD-<slug>.md`.
3. Open a PR that contains only files in this folder.
4. Leave it unmerged unless Dennis intends a Worker deploy.
