const SITE_ORIGIN = "https://jessicaridelle-beep.github.io";
const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8-fast";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin === SITE_ORIGIN ? SITE_ORIGIN : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    const json = (body, status = 200) => new Response(JSON.stringify(body), {
      status,
      headers: { ...headers, "Content-Type": "application/json; charset=utf-8" }
    });

    if (origin !== SITE_ORIGIN) return json({ error: "This website is not allowed to use this endpoint." }, 403);
    if (request.method !== "POST") return json({ error: "Use POST to send a chat message." }, 405);

    try {
      const body = await request.json();
      if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 12) {
        return json({ error: "Send between 1 and 12 messages." }, 400);
      }

      const messages = body.messages.map((message) => {
        if (!message || !["user", "assistant"].includes(message.role) ||
            typeof message.content !== "string" || !message.content.trim() ||
            message.content.length > 2000) {
          throw new Error("Each message must have a valid role and contain 1–2,000 characters.");
        }
        return { role: message.role, content: message.content.trim() };
      });

      const result = await env.AI.run(MODEL, {
        messages: [
          {
            role: "system",
            content: "You are NEXUS AI, a helpful, clear, friendly assistant. Give accurate answers, admit uncertainty, and keep responses appropriate for a general audience. Never claim to have performed actions you have not performed."
          },
          ...messages
        ],
        max_tokens: 700,
        temperature: 0.6
      });

      const reply = result && typeof result.response === "string" ? result.response : "";
      if (!reply.trim()) return json({ error: "The AI model did not return a response." }, 502);
      return json({ reply });
    } catch (error) {
      const message = error instanceof SyntaxError
        ? "The request body must be valid JSON."
        : (error && error.message ? error.message : "Unexpected server error.");
      return json({ error: message }, 400);
    }
  }
};
