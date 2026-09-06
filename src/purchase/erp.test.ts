import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ErpClient, erpBaseUrl, erpConfigured, stripCustomFields } from "./erp.ts";

describe("ERP client helpers", () => {
  it("defaults the Parsimony HCGL site and requires both API tokens", () => {
    assert.equal(erpBaseUrl({}), "https://admin.hcgamerlife.org");
    assert.equal(erpBaseUrl({ ERP_URL: "https://admin.hcgamerlife.org/" }), "https://admin.hcgamerlife.org");
    assert.equal(erpConfigured({}), false);
    assert.equal(erpConfigured({ ERP_API_KEY: "k", ERP_API_SECRET: "s" }), true);
  });

  it("strips custom_ fields so a missing Customize Form field can be retried", () => {
    assert.deepEqual(
      stripCustomFields({
        customer: "Alex",
        po_no: "cs_1",
        custom_stripe_session_id: "cs_1",
        custom_ghl_contact_id: "abc"
      }),
      { customer: "Alex", po_no: "cs_1" }
    );
  });

  it("looks up a Sales Order by po_no = Stripe session id", async () => {
    const calls: string[] = [];
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);
      calls.push(url);
      return new Response(
        JSON.stringify({
          data: [{ name: "SAL-ORD-0099", po_no: "cs_dup", docstatus: 1, customer: "Alex" }]
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    };
    const erp = new ErpClient({ ERP_URL: "https://admin.hcgamerlife.org", ERP_API_KEY: "k", ERP_API_SECRET: "s" }, fetchImpl);
    const found = await erp.findSalesOrderByStripeId("cs_dup");
    assert.equal(found?.name, "SAL-ORD-0099");
    assert.equal(found?.docstatus, 1);
    assert.match(calls[0] || "", /Sales%20Order/);
    assert.match(decodeURIComponent(calls[0] || ""), /"po_no","=","cs_dup"/);
  });
});
