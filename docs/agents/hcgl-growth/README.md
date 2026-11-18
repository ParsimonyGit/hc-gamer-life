# HCGL Growth

This folder is for the HCGL Growth Grok bot. It should open its own branch and pull request for each plan (Gleam, Lettergrowth, Branduo, Shopify Email). Do not edit hcgamerlife.org storefront files from Growth PRs unless the storefront agent reviews that change.

## What this agent should replace immediately

Growth drafts written before Nov 18, 2026 still quote **$40** and **4.4★ / 486 Amazon ratings**. The live offer is BF60 (~$52) and BF70 (~$39 each on 5+). Amazon, checked Nov 18, 2026, showed **4.2★ from 485 ratings**.

Use the offer facts in [`../README.md`](../README.md) and the copy in [`../hcgamerlife-org/2026-11-18-copy-kit.md`](../hcgamerlife-org/2026-11-18-copy-kit.md). Keep `utm_campaign=gob-bf-2026`.

## How to add a Growth proposal

1. Branch `cursor/hcgl-growth-<topic>-b974` from `main`.
2. Add `docs/agents/hcgl-growth/YYYY-MM-DD-<slug>.md`.
3. Open a PR that contains only Growth files.
