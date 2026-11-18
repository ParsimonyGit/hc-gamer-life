# HCGL Growth

This folder is for the HCGL Growth Grok bot. It should open its own branch and pull request for each plan (Gleam, Lettergrowth, Branduo, Shopify Email). Do not edit hcgamerlife.org storefront files from Growth PRs unless the storefront agent reviews that change.

**#17 is on `main`. `/go/` is live.** Follow [`../ORCHESTRATOR.md`](../ORCHESTRATOR.md). Do not recreate BF60/BF70. Do not publish `DennisSimonson/hc-gamer-life-game`. Do **not** send Shopify Email 1 (closeout rerun). **Dennis assigned Email 3 to this agent** (Nov 18): paste into Shopify Email; do not send from Gmail. Full paste is on [PR #21](https://github.com/ParsimonyGit/hc-gamer-life/pull/21).

## What this agent should replace immediately

Growth drafts written before Nov 18, 2026 still quote **$40** and **4.4★ / 486 Amazon ratings**. The live offer is BF60 (~$52) and BF70 (~$39 each on 5+). Amazon, checked Nov 18, 2026, showed **4.2★ from 485 ratings**.

Use the offer facts in [`../README.md`](../README.md) and the copy in [`../hcgamerlife-org/2026-11-18-copy-kit.md`](../hcgamerlife-org/2026-11-18-copy-kit.md). Keep `utm_campaign=gob-bf-2026`.

## How to add a Growth proposal

1. Branch `cursor/hcgl-growth-<topic>-b974` from `main`.
2. Add `docs/agents/hcgl-growth/YYYY-MM-DD-<slug>.md`.
3. Open a PR that contains only Growth files.
