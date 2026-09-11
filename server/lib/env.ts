import "dotenv/config";
import { createHash } from "node:crypto";

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: process.env.DATABASE_URL ?? "",
};

/** Throws a clear error instead of failing deep inside the db driver. */
export function requireDatabaseUrl(): string {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }
  return env.databaseUrl;
}

/**
 * Session tokens are HMAC-signed with a key derived from DATABASE_URL — the
 * only secret this deployment carries. Rotating the database credential also
 * invalidates every existing login session.
 */
export const sessionSecret = createHash("sha256")
  .update(env.databaseUrl || "infinity-fitness-dev")
  .digest();
