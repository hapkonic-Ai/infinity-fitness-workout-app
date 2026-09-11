import "dotenv/config";
import { createHash } from "node:crypto";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
};

/**
 * Session tokens are HMAC-signed with a key derived from DATABASE_URL — the
 * only secret this deployment carries. Rotating the database credential also
 * invalidates every existing login session.
 */
export const sessionSecret = createHash("sha256")
  .update(env.databaseUrl || "infinity-fitness-dev")
  .digest();
