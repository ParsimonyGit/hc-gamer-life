# Holiday publish order (orchestrator)

- **Role:** hcgamerlife.org agent is orchestrator for this campaign.
- **Date:** Nov 18, 2026 (America/Chicago)
- **Rule:** One surface, one owner. Do not publish the same offer copy from two agents. Do not merge to `main` unless you mean to deploy the Cloudflare Worker.

`main` on `ParsimonyGit/hc-gamer-life` auto-deploys hcgamerlife.org. Docs-only PRs still trigger that deploy. That is fine if the Worker code is unchanged; it is not fine if an old copy PR lands.

## Surfaces (what to publish, in this order)

| Order | Surface | Git repo? | Owner | Status Nov 18 |
|---|---|---|---|---|
| 0 | Shopify discounts BF60 / BF70 | No. Shopify Admin only. | Orchestrator / Dennis | **Live.** Do not recreate. |
| 1 | Shopify theme **HC GamerLife Trust+Hero 2026-11-18** | No. Shopify theme, not git. | Shopify theme agent | **Published** (`gid://shopify/OnlineStoreTheme/161914454087`). Do not publish a second live theme until Dennis says yes. |
| 1b | Unpublished **HC GamerLife Holiday Copy 2026-11-18** | No. Shopify theme. | Orchestrator applied #19 copy | **Ready, not live** (`gid://shopify/OnlineStoreTheme/161920581703`). Dennis must `theme_publish`. |
| 2 | Agent proposal docs | `ParsimonyGit/hc-gamer-life` → `docs/agents/<agent-id>/` | Each agent, own PR | **#18 merged.** Copy kit Email 3 is on `main` via #22. |
| 3 | hcgamerlife.org Worker (sales pitch, `/go/` links, GOB demotion) | `ParsimonyGit/hc-gamer-life` only | Storefront agent | **#17 and #20 merged and live.** Topline is Black Friday / in stock now. |
| 4 | Outbound (email, coupons, Gleam, Collabs, Reddit) | No git. Copy lives in `docs/agents/`. | HCGL Growth | `/go/` is live. Growth PR [#21](https://github.com/ParsimonyGit/hc-gamer-life/pull/21). **Dennis assigned Shopify Email 3 to Growth** (Nov 18). Do not send Email 1. Honey already sent from `tezlin007@gmail.com`. |
| 5 | Google Merchant Center / Amazon B07BHYZFLF | No git | Dennis | HCG1 Pro is **already published** to the Shopify Google & YouTube channel. Remaining: Merchant Center free listings + BF60 promotion in admin, and Amazon Seller Central reactivate. |

## Do not publish these for this campaign

| Repo | Why |
|---|---|
| `DennisSimonson/hc-gamer-life-game` | Game vertical slice. Not the storefront. |
| Any other ParsimonyGit / DennisSimonson repo | Wrong product. |
| PRs **#8, #9, #10** on hc-gamer-life | Stale Worker PRs. #8 reintroduces guarantee language. Merging any of them to `main` deploys the Worker and can overwrite holiday copy. Leave them open or close; do not merge until after Nov 30. |

## GitHub PRs right now

| PR | Agent | Merge? |
|---|---|---|
| #16 #17 #18 #20 #22 | Storefront / orchestrator | **Merged.** |
| [#21](https://github.com/ParsimonyGit/hc-gamer-life/pull/21) | HCGL Growth | Docs. Email 3 assignment is on this PR. Safe to merge (Worker code unchanged) after Growth rebases onto current `main`. |
| [#19](https://github.com/ParsimonyGit/hc-gamer-life/pull/19) | Codex (ChatGPT connector) | Proposal only. Copy already applied on unpublished Holiday Copy theme. Do **not** merge as a second coupon kit. |
| #8 #9 #10 | Older Grok storefront work | **Do not merge** during BF60/BF70. |

## Who writes where

| Agent | Writes | Does not write |
|---|---|---|
| Storefront / orchestrator | `src/` on hc-gamer-life, `docs/agents/hcgamerlife-org/`, this file | Live Shopify theme publish, Gleam, Shopify Email sends |
| HCGL Growth | `docs/agents/hcgl-growth/` only, then sends | `src/`, Shopify theme, recreating BF60/BF70, Shopify Email 1 |
| Codex / theme QA | `docs/agents/codex/` for QA notes | Worker `src/`, a second live theme, coupon listings already in #18 |
| Anyone else | A new `docs/agents/<id>/` PR | Direct `main`, live Shopify theme, `$40` copy |

## After #17 is on `main` (done)

1. `https://hcgamerlife.org/go/email` 302s to Shopify with `utm_campaign=gob-bf-2026`. **Verified.**
2. Next Shopify Email is **Email 3** (reviews + free shipping), not Email 1. **HCGL Growth sends it** in Shopify Email. Do not send from Gmail. Assignment is on [PR #21](https://github.com/ParsimonyGit/hc-gamer-life/pull/21).
3. Theme copy fixes sit on unpublished Holiday Copy. One publish, after Dennis yes.

## Offer facts (all agents)

Regular $129.99. BF60 ~$52. BF70 ~$39 each on 5+. Codes end Nov 30, 2026, 11:59 PM CT. Free continental US shipping. Sold without warranty. 30-day returns. 90-day defect replacement. No `$40`. No 2-year guarantee. Do not lead with going-out-of-business; keep it in terms/FAQ.
