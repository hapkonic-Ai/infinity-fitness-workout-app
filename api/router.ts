import { authRouter } from "./auth-router";
import { adminRouter } from "./admin";
import { contentRouter } from "./content";
import { geoRouter } from "./geo";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  geo: geoRouter,
  content: contentRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
