# HCG1 Holiday Conversion QA and Proposal

- Date: 2026-11-18
- Repository: `ParsimonyGit/hc-gamer-life`
- Branch: `codex/holiday-conversion-qa-proposal`
- Status: Proposal only. No production source, Shopify discount, price, or theme change is included in this branch.
- Scope: `hcgamerlife.com` and the HCG1 Pro Wired Gaming Headset purchase path.

## Live verification after the new theme was published

Checked the public homepage, HCG1 product page, refund policy, and cart flow.

- Homepage: https://www.hcgamerlife.com/
- Product page: https://www.hcgamerlife.com/products/gaming-headset-xbox-one-ps4-pc-mobile-compatible
- BF60 cart test: one HCG1 applied BF60 at $52.00, with free continental U.S. shipping shown.
- BF70 cart test: five HCG1 units applied BF70 at $39.00 each, $195.00 subtotal, with free continental U.S. shipping shown.
- The test cart was cleared after QA.
- The Shopify discount records remain the source of truth:
  - BF60: 60% off, no minimum quantity, ends November 30 at 11:59 PM CT.
  - BF70: 70% off, minimum quantity of five, ends November 30 at 11:59 PM CT.
  - Both are online-store discounts and cannot combine with other discounts.
- Shipping policy confirms free shipping to the 48 contiguous states and Washington, DC.
- Refund policy confirms 30-day returns and 90-day defect replacement as the remedies for final-stock purchases sold without warranty.

## Findings

### 1. Coupon implementation is working

The published theme does not break the purchase path. Both promotional prices calculate correctly:

- $129.99 less 60% = approximately $52.00.
- $129.99 less 70% = approximately $39.00 each.
- Five units at the BF70 price = $195.00.

### 2. “Going out of business” copy is still visible

The new theme removed it from the top banner, but it remains in high-visibility content:

- Homepage sale terms: “HC GamerLife is going out of business.”
- Product page: “Going-out-of-business sale terms.”
- The product page also says “final stock, no restock.”

If the holiday campaign is meant to lead with savings, replace the high-visibility “going out of business” language with “Black Friday + Holiday Savings” and keep the final-stock/no-restock disclosure in the offer terms, FAQ, and policy pages.

### 3. Warranty and remedy language needs one consistent explanation

The product page currently says both:

- “30-day returns and 90-day defect replacement on every order.”
- “Sold without warranty.”

The refund policy explains the intended meaning, but the product page should make the relationship explicit so customers do not read it as a contradiction.

Recommended wording:

> Final-stock purchase: no manufacturer warranty. New, unused items may be returned within 30 days. Defective, damaged, or wrong items qualify for same-item replacement within 90 days of purchase; if a replacement is unavailable, we refund the purchase.

### 4. Public offer copy should state the non-stacking rule

The Shopify records correctly prevent stacking, but the public product copy does not currently say so. Add:

> BF60 and BF70 cannot be combined with other discount codes.

### 5. The deadline should use one timezone everywhere

The product page says “November 30 at 11:59 PM CT,” while the banner only says “Codes end Nov 30.” Use the full deadline in the hero and offer block:

> Ends November 30 at 11:59 PM CT.

### 6. There is no post-November 30 offer in this proposal

The current BF60 and BF70 records expire before the Christmas selling window. Create a separate December offer only after approving:

- the December code names,
- the one-unit discount,
- the five-unit/bulk discount,
- the final order date and shipping promise.

Do not silently extend the Black Friday discounts.

## Proposed workstreams

### P1 — Holiday-led above-the-fold copy

Replace the high-visibility sale headline with:

> Black Friday + Holiday Savings

Supporting copy:

> Save 60% on the HCG1 with code BF60 — about $52. Buy 5 or more and save 70% with code BF70 — about $39 each. Free continental U.S. shipping. Final stock. Ends November 30 at 11:59 PM CT.

Keep “final stock” truthful and visible, but remove “going out of business” from the first impression unless that message is an intentional business decision.

### P2 — Product-page trust block

Use one compact block near the buy button:

> 30-day returns. Final-stock purchase with no manufacturer warranty. Defective, damaged, or wrong items are eligible for replacement within 90 days. Support replies within 1 business day.

Link “full return terms” to the refund policy.

### P3 — Offer clarity

Near the price and buy button, show:

- BF60: 60% off one or more HCG1 headsets, about $52 each.
- BF70: 70% off when the cart contains 5 or more HCG1 headsets, about $39 each.
- Codes entered at Shopify checkout.
- Codes cannot be combined.
- Free continental U.S. shipping.
- Ends November 30 at 11:59 PM CT.

### P4 — Christmas continuation

Prepare a separate December campaign brief. The December offer should not be published until the end date, code names, and shipping cutoff are approved. Use a holiday-oriented name and preserve the same product scope and minimum-quantity logic unless margin or inventory requires a change.

### P5 — Repeatable agent QA

Every future theme or campaign agent should record:

1. Git branch and commit.
2. Live homepage URL and product URL.
3. Mobile and desktop screenshots.
4. BF60 one-unit cart result.
5. BF70 five-unit cart result.
6. BF70 four-unit threshold result.
7. Shipping and refund-policy link checks.
8. Any remaining copy mismatch.
9. Whether production changes were made or only proposed.

## Acceptance criteria before the next traffic push

- One above-the-fold offer message is used consistently.
- BF60 and BF70 terms match Shopify exactly.
- The non-stacking rule is visible.
- The warranty/remedy wording is clear and matches the refund policy.
- The December plan is approved before November 30.
- Homepage CTA reaches the HCG1 product page.
- BF60 and BF70 cart tests pass after the next publish.
- Test cart is cleared after QA.
- No agent claims a change is live without a post-publish check.

