# Agent proposals

Holiday and growth work for HC GamerLife is reviewed in GitHub, not in a bot store or a chat transcript.

**Publish order (orchestrator):** read [`ORCHESTRATOR.md`](ORCHESTRATOR.md) before merging or sending anything. `main` auto-deploys the Cloudflare Worker. Shopify theme and discounts are not git repos. `/go/` is live. Growth may send from the copy kit except Shopify Email 1.

## How to version a proposal

1. Open a branch named `cursor/<short-name>-b974`.
2. Put the write-up under `docs/agents/<agent-id>/YYYY-MM-DD-<slug>.md`.
3. Open a pull request. One agent, one proposal thread. Do not append a second agent's plan onto another agent's PR.
4. Do not send Shopify Email 1. Do not merge PRs #8, #9, or #10. Do not publish a second live Shopify theme.

## Agents

| Agent | Folder | What it owns |
|---|---|---|
| hcgamerlife.org (this Worker / storefront agent) | [`hcgamerlife-org/`](hcgamerlife-org/) | Storefront copy on hcgamerlife.org, tracked `/go/` links, sale-terms tests, and outbound channel proposals that land shoppers on Shopify |
| HCGL Growth (Grok bot) | [`hcgl-growth/`](hcgl-growth/) | Gleam, Lettergrowth, Branduo, subscriber email flows, and partner giveaways |

## Live offer (do not regress)

- Regular price $129.99.
- **BF60:** 60% off, about $52.
- **BF70:** 70% off orders of 5 or more, about $39 each.
- Codes are entered at Shopify checkout and end Nov 30, 2026.
- Free shipping, continental US only.
- Final stock. We are not restocking.
- Sold without warranty. 30-day returns (buyer pays return shipping unless the unit is defective). Defective units replaced within 90 days.
- Never publish: `$40`, `2-year` / `guarantee`, `no questions asked`, a unit count, or a ship-by date that is not on the live Shopify theme.
