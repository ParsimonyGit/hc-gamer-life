import { submitQuiz, type QuizEnv } from "./ghl.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "cache-control": "no-store"
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      ...CORS
    }
  });
}

export async function handleQuizApi(request: Request, env: QuizEnv): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  try {
    const result = await submitQuiz(env, raw);
    return json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submit failed";
    const status = /not configured/i.test(message) ? 503 : 400;
    return json({ ok: false, error: message }, status);
  }
}
