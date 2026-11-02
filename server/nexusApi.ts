import type { Express, Request, Response } from "express";
import { PROVIDERS, PROVIDER_IDS, type ProviderId } from "../shared/nexus";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;
};

const buckets = new Map<string, { count: number; resetAt: number }>();

function allowRequest(req: Request, res: Response) {
  const now = Date.now();
  const key = `${req.ip || "unknown"}:${req.path}`;
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + 60_000 };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > 40) {
    res.status(429).json({ error: "Too many requests. Please wait a minute and try again." });
    return false;
  }
  if (buckets.size > 2_000) {
    for (const [id, item] of buckets) if (item.resetAt <= now) buckets.delete(id);
  }
  res.setHeader("Cache-Control", "no-store");
  return true;
}

function apiMessage(data: unknown): string {
  const body = data as { choices?: Array<{ message?: { content?: unknown } }>; error?: { message?: string } };
  if (body?.error?.message) return body.error.message.slice(0, 900);
  const content = body?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map(part => typeof part?.text === "string" ? part.text : "").filter(Boolean).join("\n");
  }
  throw new Error("The provider returned an empty or unsupported response.");
}

function isProvider(value: unknown): value is ProviderId {
  return typeof value === "string" && (PROVIDER_IDS as string[]).includes(value);
}

function validMessages(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 50) return false;
  return value.every((entry: unknown) => {
    const message = entry as ChatMessage;
    if (!message || !["system", "user", "assistant"].includes(message.role)) return false;
    if (typeof message.content === "string") return message.content.length <= 100_000;
    if (!Array.isArray(message.content) || message.content.length > 5) return false;
    return message.content.every((part: unknown) => {
      const item = part as { type?: unknown; text?: unknown; image_url?: { url?: unknown } } | null;
      if (item?.type === "text") return typeof item.text === "string" && item.text.length <= 100_000;
      if (item?.type === "image_url") {
        const url = item.image_url?.url;
        return typeof url === "string" && url.length <= 16_000_000 && /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(url);
      }
      return false;
    });
  });
}

function registerChatRoute(app: Express) {
  app.post("/api/chat", async (req: Request, res: Response) => {
    if (!allowRequest(req, res)) return;
    const { provider, model, apiKey, messages } = req.body ?? {};
    if (!isProvider(provider)) return res.status(400).json({ error: "Choose a supported AI provider." });
    if (typeof model !== "string" || !model.trim() || model.length > 200) return res.status(400).json({ error: "Choose a valid model ID." });
    if (typeof apiKey !== "string" || apiKey.trim().length < 8 || apiKey.length > 500) return res.status(400).json({ error: "Add this provider's API key in Settings." });
    if (!validMessages(messages)) return res.status(400).json({ error: "The chat message or image is invalid or too large." });

    const config = PROVIDERS[provider];
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json",
    };
    if (provider === "openrouter") {
      headers["HTTP-Referer"] = req.get("origin") || "http://localhost:3000";
      headers["X-Title"] = "Nexus Personal AI";
    }
    try {
      const response = await fetch(`${config.endpoint}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({ model: model.trim(), messages, temperature: 0.7 }),
        signal: AbortSignal.timeout(120_000),
      });
      const raw = await response.text();
      let data: unknown;
      try { data = JSON.parse(raw); } catch { data = { error: { message: raw.slice(0, 900) } }; }
      if (!response.ok) {
        const message = apiMessage(data);
        return res.status(502).json({ error: `${config.label} API (${response.status}): ${message}` });
      }
      return res.json({ content: apiMessage(data), provider });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Provider request failed.";
      return res.status(502).json({ error: `${config.label}: ${message.slice(0, 900)}` });
    }
  });
}

function registerResearchRoute(app: Express) {
  app.post("/api/research", async (req: Request, res: Response) => {
    if (!allowRequest(req, res)) return;
    const { query, apiKey } = req.body ?? {};
    if (typeof query !== "string" || !query.trim() || query.length > 4_000) return res.status(400).json({ error: "Enter a shorter research question." });
    if (typeof apiKey !== "string" || apiKey.trim().length < 8 || apiKey.length > 500) return res.status(400).json({ error: "Add your Tavily key in Settings to use Research mode." });
    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey.trim(), query: query.trim(), search_depth: "basic", max_results: 5, include_answer: true }),
        signal: AbortSignal.timeout(30_000),
      });
      const data = await response.json() as { answer?: string; results?: Array<{ title?: string; content?: string; url?: string }> };
      if (!response.ok) return res.status(502).json({ error: `Tavily API (${response.status}): ${JSON.stringify(data).slice(0, 600)}` });
      const sources = (data.results ?? []).map(item => ({ title: item.title ?? "Source", url: item.url ?? "", content: item.content ?? "" }));
      const context = [data.answer ? `Tavily summary: ${data.answer}` : "", ...sources.map(source => `- ${source.title}\n  ${source.content}\n  URL: ${source.url}`)].filter(Boolean).join("\n\n");
      return res.json({ answer: data.answer ?? "", sources, context });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Research search failed.";
      return res.status(502).json({ error: `Tavily: ${message.slice(0, 600)}` });
    }
  });
}

export function registerNexusRoutes(app: Express) {
  registerChatRoute(app);
  registerResearchRoute(app);
}
