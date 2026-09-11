import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { neon } from "@neondatabase/serverless";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

/**
 * Deployment diagnostics: confirms the function booted and whether it can
 * reach Postgres. Carries no secrets.
 */
app.get("/api/health", async (c) => {
  let db: "up" | "down" = "down";
  if (env.databaseUrl) {
    try {
      const sql = neon(env.databaseUrl);
      await sql`select 1`;
      db = "up";
    } catch {
      db = "down";
    }
  }
  return c.json({
    ok: true,
    db,
    databaseUrlConfigured: Boolean(env.databaseUrl),
    time: new Date().toISOString(),
  });
});

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;
