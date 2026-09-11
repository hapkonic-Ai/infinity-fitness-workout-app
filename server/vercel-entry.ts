import type { IncomingMessage, ServerResponse } from "node:http";
import app from "./app";

/**
 * Vercel's Node runtime hands handlers the raw Node req/res pair, while the
 * app (and hono middleware) speaks Fetch API `Request`. Convert at the edge.
 */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const proto = (req.headers["x-forwarded-proto"] as string) ?? "https";
  const host = req.headers.host ?? "localhost";
  const url = `${proto}://${host}${req.url ?? "/"}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  const method = req.method ?? "GET";
  let body: RequestInit["body"] | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    body = Buffer.concat(chunks);
  }

  const request = new Request(url, { method, headers, body });
  const response = await app.fetch(request);

  res.statusCode = response.status;
  const getSetCookie = (
    response.headers as Headers & { getSetCookie?: () => string[] }
  ).getSetCookie?.bind(response.headers);
  for (const cookie of getSetCookie?.() ?? []) {
    const previous = res.getHeader("set-cookie");
    res.setHeader("set-cookie", [
      ...(Array.isArray(previous) ? previous : previous ? [String(previous)] : []),
      cookie,
    ]);
  }
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") res.setHeader(key, value);
  });

  res.end(Buffer.from(await response.arrayBuffer()));
}
