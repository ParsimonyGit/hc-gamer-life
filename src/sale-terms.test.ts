import assert from "node:assert/strict";
import { describe, it } from "node:test";
import worker from "./index.ts";
import { GOB_SALE_TERMS } from "./sale.ts";

const env = {
  ASSETS: { fetch: async () => new Response(null, { status: 404 }) }
};

async function page(path: string): Promise<string> {
  const response = await worker.fetch(new Request(`https://hcgamerlife.org${path}`), env);
  assert.equal(response.status, 200, path);
  return response.text();
}

const forbidden = [/2-year/i, /two-year/i, /two year/i, /no-questions/i, /no questions asked/i];

describe("going-out-of-business sale copy", () => {
  it("states the live sale terms on the homepage, quiz, terms, and privacy pages", async () => {
    const home = await page("/");
    const quiz = await page("/quiz");
    const terms = await page("/terms");
    const privacy = await page("/privacy-policy");
    const privacyAlias = await page("/privacy");
    const journal = await page("/journal/first-gaming-headset-gift-guide");

    for (const html of [home, quiz, terms, privacy, privacyAlias, journal]) {
      for (const pattern of forbidden) {
        assert.doesNotMatch(html, pattern);
      }
    }

    assert.match(home, new RegExp(GOB_SALE_TERMS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(home, /There is no fixed end date/);
    assert.match(home, /\$129\.99/);
    assert.match(home, /53mm/);
    assert.match(home, /Wired 3\.5mm/);
    assert.match(home, /Detachable boom/);
    assert.match(home, /1037 NE 65th St #80853/);
    assert.match(terms, /Sold without warranty/);
    assert.match(terms, /30-day returns/);
    assert.match(terms, /within 90 days/);
    assert.match(terms, /\$12 flat/);
    assert.match(terms, /continental United States only/);
    assert.match(privacy, /30-day returns/);
    assert.match(privacy, /defective units within 90 days/);
    assert.match(privacy, /1037 NE 65th St #80853/);
    assert.match(quiz, /\$40 while supplies last/);
  });
});
