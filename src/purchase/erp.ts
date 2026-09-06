/** Parsimony / ERPNext REST client for HC GamerLife purchases. */

import { DEFAULT_ERP_URL, HCG1_ITEM_CODE, HCG1_UNIT_RATE, type ExistingSalesOrder, type PurchasePlan } from "./map.ts";

export type ErpEnv = {
  ERP_URL?: string;
  ERP_API_KEY?: string;
  ERP_API_SECRET?: string;
  ERP_COMPANY?: string;
  ERP_CUSTOMER_GROUP?: string;
  ERP_TERRITORY?: string;
  ERP_ITEM_CODE?: string;
  ERP_ITEM_RATE?: string;
};

export type ErpCustomer = { name: string; email?: string };

export type CreatedSalesOrder = { name: string; submitted: boolean };

type ResourceList<T> = { data?: T[] };
type ResourceDoc<T> = { data?: T; exception?: string; _server_messages?: string; message?: string };

function todayIso(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function plusDaysIso(days: number, date = new Date()): string {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return todayIso(next);
}

export function erpConfigured(env: ErpEnv): boolean {
  return Boolean(env.ERP_API_KEY?.trim() && env.ERP_API_SECRET?.trim());
}

export function erpBaseUrl(env: ErpEnv): string {
  return (env.ERP_URL?.trim() || DEFAULT_ERP_URL).replace(/\/+$/, "");
}

export function erpItemCode(env: ErpEnv): string {
  return env.ERP_ITEM_CODE?.trim() || HCG1_ITEM_CODE;
}

export function erpItemRate(env: ErpEnv): number {
  const parsed = Number.parseFloat(String(env.ERP_ITEM_RATE ?? ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : HCG1_UNIT_RATE;
}

function erpHeaders(env: ErpEnv): HeadersInit {
  const key = env.ERP_API_KEY?.trim() || "";
  const secret = env.ERP_API_SECRET?.trim() || "";
  return {
    Authorization: `token ${key}:${secret}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  };
}

function frappeMessage(payload: { exception?: string; _server_messages?: string; message?: unknown }): string {
  if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  if (typeof payload.exception === "string" && payload.exception.trim()) return payload.exception;
  if (typeof payload._server_messages === "string" && payload._server_messages.trim()) {
    try {
      const parsed = JSON.parse(payload._server_messages) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .map((entry) => {
            if (typeof entry === "string") {
              try {
                const inner = JSON.parse(entry) as { message?: string };
                return inner.message || entry;
              } catch {
                return entry;
              }
            }
            return String(entry);
          })
          .join(" ");
      }
    } catch {
      return payload._server_messages;
    }
  }
  return "";
}

function isUnknownFieldError(message: string): boolean {
  return /unknown field|no such field|field not permitted|custom_/i.test(message);
}

export class ErpClient {
  constructor(
    private readonly env: ErpEnv,
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  private url(path: string): string {
    return `${erpBaseUrl(this.env)}${path}`;
  }

  private async request(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; body: Record<string, unknown> }> {
    const response = await this.fetchImpl(this.url(path), {
      ...init,
      headers: { ...erpHeaders(this.env), ...(init?.headers || {}) }
    });
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: response.ok, status: response.status, body };
  }

  async findCustomerByEmail(email: string): Promise<ErpCustomer | null> {
    const filters = JSON.stringify([["email_id", "=", email]]);
    const fields = JSON.stringify(["name", "email_id", "customer_name"]);
    const result = await this.request(
      `/api/resource/Customer?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}&limit_page_length=5`
    );
    const rows = (result.body as ResourceList<{ name?: string; email_id?: string }>).data || [];
    const match = rows.find((row) => row.name);
    return match?.name ? { name: match.name, email: match.email_id } : null;
  }

  async findSalesOrderByStripeId(stripeSessionId: string): Promise<ExistingSalesOrder | null> {
    const fields = JSON.stringify(["name", "po_no", "docstatus", "customer"]);
    const searches = [
      [["po_no", "=", stripeSessionId]],
      [["custom_stripe_session_id", "=", stripeSessionId]]
    ];

    for (const filters of searches) {
      const result = await this.request(
        `/api/resource/Sales Order?filters=${encodeURIComponent(JSON.stringify(filters))}&fields=${encodeURIComponent(fields)}&limit_page_length=5`
      );
      if (!result.ok && isUnknownFieldError(frappeMessage(result.body))) continue;
      const rows = (result.body as ResourceList<ExistingSalesOrder>).data || [];
      const match = rows.find((row) => row.name);
      if (match?.name) {
        return {
          name: match.name,
          docstatus: Number(match.docstatus) || 0,
          customer: match.customer
        };
      }
    }
    return null;
  }

  async upsertCustomer(plan: PurchasePlan, ghlContactId?: string): Promise<ErpCustomer> {
    const existing = await this.findCustomerByEmail(plan.email);
    const doc: Record<string, unknown> = {
      customer_name: plan.customerName,
      customer_type: "Individual",
      customer_group: this.env.ERP_CUSTOMER_GROUP?.trim() || "All Customer Groups",
      territory: this.env.ERP_TERRITORY?.trim() || "All Territories",
      email_id: plan.email
    };
    if (plan.phone) doc.mobile_no = plan.phone;
    if (ghlContactId) doc.custom_ghl_contact_id = ghlContactId;

    if (existing) {
      await this.updateResource("Customer", existing.name, {
        email_id: plan.email,
        ...(plan.phone ? { mobile_no: plan.phone } : {}),
        ...(ghlContactId ? { custom_ghl_contact_id: ghlContactId } : {})
      });
      return existing;
    }

    try {
      const created = await this.insertResource<{ name?: string }>("Customer", doc);
      if (!created.name) throw new Error("ERP did not return a Customer name");
      return { name: created.name, email: plan.email };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (!/already exists|duplicate/i.test(message)) throw error;
      doc.customer_name = `${plan.customerName} (${plan.email})`.slice(0, 140);
      const created = await this.insertResource<{ name?: string }>("Customer", doc);
      if (!created.name) throw new Error("ERP did not return a Customer name");
      return { name: created.name, email: plan.email };
    }
  }

  async storeGhlContactId(customerName: string, contactId: string): Promise<void> {
    await this.updateResource("Customer", customerName, { custom_ghl_contact_id: contactId });
  }

  async createSubmittedSalesOrder(plan: PurchasePlan, customer: string): Promise<CreatedSalesOrder> {
    const doc: Record<string, unknown> = {
      customer,
      order_type: "Sales",
      transaction_date: todayIso(),
      delivery_date: plusDaysIso(7),
      po_no: plan.poNo,
      po_date: todayIso(),
      currency: plan.currency.toUpperCase(),
      conversion_rate: 1,
      remarks: plan.remarks,
      items: [
        {
          item_code: plan.itemCode,
          qty: plan.quantity,
          rate: plan.rate,
          description: "HCG1 Pro Gaming Headset"
        }
      ],
      custom_stripe_session_id: plan.stripeSessionId
    };
    if (plan.stripePaymentIntentId) doc.custom_stripe_payment_id = plan.stripePaymentIntentId;
    if (this.env.ERP_COMPANY?.trim()) doc.company = this.env.ERP_COMPANY.trim();

    const created = await this.insertResource<Record<string, unknown> & { name?: string }>("Sales Order", doc);
    if (!created.name) throw new Error("ERP did not return a Sales Order name");
    const submitted = await this.submitDoc("Sales Order", created);
    return { name: created.name, submitted };
  }

  async submitSalesOrder(name: string): Promise<CreatedSalesOrder> {
    const result = await this.request(`/api/resource/Sales Order/${encodeURIComponent(name)}`);
    const doc = (result.body as ResourceDoc<Record<string, unknown> & { name?: string }>).data;
    if (!result.ok || !doc?.name) {
      throw new Error(frappeMessage(result.body) || `Could not load Sales Order ${name}`);
    }
    if (Number((doc as { docstatus?: number }).docstatus) === 1) {
      return { name: doc.name, submitted: true };
    }
    const submitted = await this.submitDoc("Sales Order", doc);
    return { name: doc.name, submitted };
  }

  private async insertResource<T extends { name?: string }>(doctype: string, doc: Record<string, unknown>): Promise<T> {
    const attempt = async (body: Record<string, unknown>) => {
      const result = await this.request(`/api/resource/${encodeURIComponent(doctype)}`, {
        method: "POST",
        body: JSON.stringify(body)
      });
      return result;
    };

    let result = await attempt(doc);
    if (!result.ok && isUnknownFieldError(frappeMessage(result.body))) {
      result = await attempt(stripCustomFields(doc));
    }
    if (!result.ok) {
      throw new Error(frappeMessage(result.body) || `ERP create ${doctype} failed (${result.status})`);
    }
    const created = (result.body as ResourceDoc<T>).data;
    if (!created) throw new Error(`ERP create ${doctype} returned no document`);
    return created;
  }

  private async updateResource(doctype: string, name: string, values: Record<string, unknown>): Promise<void> {
    const attempt = async (body: Record<string, unknown>) =>
      this.request(`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`, {
        method: "PUT",
        body: JSON.stringify(body)
      });

    let result = await attempt(values);
    if (!result.ok && isUnknownFieldError(frappeMessage(result.body))) {
      const stripped = stripCustomFields(values);
      if (Object.keys(stripped).length === 0) return;
      result = await attempt(stripped);
    }
    if (!result.ok) {
      throw new Error(frappeMessage(result.body) || `ERP update ${doctype} failed (${result.status})`);
    }
  }

  private async submitDoc(doctype: string, doc: Record<string, unknown>): Promise<boolean> {
    const result = await this.request("/api/method/frappe.client.submit", {
      method: "POST",
      body: JSON.stringify({ doc: { doctype, ...doc } })
    });
    if (result.ok) return true;
    const message = frappeMessage(result.body);
    throw new Error(message || `ERP submit ${doctype} failed (${result.status})`);
  }
}

function stripCustomFields(doc: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(doc)) {
    if (key.startsWith("custom_")) continue;
    next[key] = value;
  }
  return next;
}

export { stripCustomFields };
