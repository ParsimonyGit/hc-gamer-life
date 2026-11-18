# Holiday publish order (orchestrator)

- **Role:** hcgamerlife.org agent is orchestrator for this campaign.
- **Date:** Nov 18, 2026 (America/Chicago)
- **Rule:** One surface, one owner. Do not publish the same offer copy from two agents. Do not merge to `main` unless you mean to deploy the Cloudflare Worker.

`main` on `ParsimonyGit/hc-gamer-life` auto-deploys hcgamerlife.org. Docs-only PRs still trigger that deploy. That is fine if the Worker code is unchanged; it is not fine if an old copy PR lands.

## Surfaces (what to publish, in this order)

| Order | Surface | Git repo? | Owner | Status Nov 18 |
|---|---|---|---|---|
| 0 | Shopify discounts BF60 / BF70 | No. Shopify Admin only. | Orchestrator / Dennis | **Live.** Do not recreate. |
| 1 | Shopify theme **HC GamerLife Trust+Hero 2026-11-18** | No. Shopify theme, not git. | Shopify theme agent (Codex QA may propose; one agent applies) | **Published.** Do not publish a second live theme. |
| 2 | Agent proposal docs | `ParsimonyGit/hc-gamer-life` → `docs/agents/<agent-id>/` | Each agent, own PR | **This PR (#18)** is the convention. Merge before other docs folders if they conflict. |
| 3 | hcgamerlife.org Worker (sales pitch, `/go/` links, `#squads`) | `ParsimonyGit/hc-gamer-life` only | Storefront agent (this run) | **PR #17**, not merged. This is the next git publish. |
| 4 | Outbound (email, coupons, Gleam, Collabs, Reddit) | No git. Copy lives in `docs/agents/`. Sends happen after #17 is live so `/go/` URLs resolve. | HCGL Growth | Not started. Growth opens its own PR under `docs/agents/hcgl-growth/`. |
| 5 | Google Merchant Center / Amazon B07BHYZFLF | No git | Dennis + Growth | Not started. After #17, not instead of it. |

## Do not publish these for this campaign

| Repo | Why |
|---|---|
| `DennisSimonson/hc-gamer-life-game` | Game vertical slice. Not the storefront. |
| Any other ParsimonyGit / DennisSimonson repo | Wrong product. |
| PRs **#8, #9, #10** on hc-gamer-life | Stale Worker PRs. #8 reintroduces guarantee language. Merging any of them to `main` deploys the Worker and can overwrite holiday copy. Leave them open or close; do not merge until after Nov 30. |

## GitHub PRs right now

| PR | Agent | Merge? |
|---|---|---|
| [#18](https://github.com/ParsimonyGit/hc-gamer-life/pull/18) | Storefront / orchestrator | Docs convention. Safe to merge first (Worker code unchanged). |
| [#17](https://github.com/ParsimonyGit/hc-gamer-life/pull/17) | Storefront | Next Worker publish. After #18 if both land. |
| [#19](https://github.com/ParsimonyGit/hc-gamer-life/pull/19) | Codex (ChatGPT connector) | Proposal only. Do **not** treat as a second coupon kit. Move later files to `docs/agents/codex/`. Do not merge until it uses that folder and does not duplicate #18 copy. |
| #8 #9 #10 | Older Grok storefront work | **Do not merge** during BF60/BF70. |

## Who writes where

| Agent | Writes | Does not write |
|---|---|---|
| Storefront / orchestrator | `src/` on hc-gamer-life, `docs/agents/hcgamerlife-org/`, this file | Shopify theme files, Gleam, Shopify Email sends |
| HCGL Growth | `docs/agents/hcgl-growth/` only, then sends after #17 is live | `src/`, Shopify theme, recreating BF60/BF70 |
| Codex / theme QA | `docs/agents/codex/` for QA notes; unpublished Shopify theme duplicates if Dennis assigns theme work | Worker `src/`, a second live theme, coupon listings already in #18 |
| Anyone else | A new `docs/agents/<id>/` PR | Direct `main`, live Shopify theme, `$40` copy |

## After #17 is on `main`

1. Confirm `https://hcgamerlife.org/go/email` 302s to Shopify with `utm_campaign=gob-bf-2026`.
2. Growth may send Shopify Email and submit coupon listings from the copy kit in #18.
3. Theme copy fixes (GOB demotion, non-stacking line, timezone) go through one unpublished Shopify theme, then one publish. Not through the Worker.

## Offer facts (all agents)

Regular $129.99. BF60 ~$52. BF70 ~$39 each on 5+. Codes end Nov 30, 2026, 11:59 PM CT. Free continental US shipping. Sold without warranty. 30-day returns. 90-day defect replacement. No `$40`. No 2-year guarantee.
