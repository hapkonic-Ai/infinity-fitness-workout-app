import * as cookie from "cookie";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { env } from "./lib/env";
import { signSessionToken } from "./kimi/session";
import { upsertUser } from "./queries/users";
import { createRouter, authedQuery, publicQuery } from "./middleware";

// Simple staff/trainee logins for the gym — shared credential pairs.
// The app auto-signs trainees in with the shared "trainee" account, so no
// login screen is needed for everyday use. The admin pair opens the
// admin panel (gym location config) via /login.
const LOCAL_USERS: Record<
  string,
  { password: string; name: string; role: "user" | "admin" }
> = {
  admin: { password: "admin123", name: "Admin", role: "admin" },
  trainee: { password: "trainee123", name: "Trainee", role: "user" },
};

export const authRouter = createRouter({
  loginPassword: publicQuery
    .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const account = LOCAL_USERS[input.username.trim().toLowerCase()];
      if (!account || account.password !== input.password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }
      const unionId = `local:${input.username.trim().toLowerCase()}`;
      await upsertUser({
        unionId,
        name: account.name,
        role: account.role,
        lastSignInAt: new Date(),
      });
      const token = await signSessionToken({ unionId, clientId: env.appId });
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );
      return { success: true };
    }),

  me: authedQuery.query((opts) => opts.ctx.user),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
