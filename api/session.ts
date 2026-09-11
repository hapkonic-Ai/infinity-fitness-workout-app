import * as jose from "jose";
import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { Errors } from "@contracts/errors";
import { sessionSecret } from "./lib/env";
import { findUserByUnionId } from "./queries/users";

const JWT_ALG = "HS256";

export type SessionPayload = {
  unionId: string;
};

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("1 year")
    .sign(sessionSecret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jose.jwtVerify(token, sessionSecret, {
      algorithms: [JWT_ALG],
    });
    if (!payload.unionId) return null;
    return { unionId: payload.unionId as string };
  } catch {
    return null;
  }
}

/** Resolves the signed session cookie to a database user, or throws. */
export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  const claim = token ? await verifySessionToken(token) : null;
  if (!claim) {
    throw Errors.forbidden("Invalid authentication token.");
  }
  const user = await findUserByUnionId(claim.unionId);
  if (!user) {
    throw Errors.forbidden("User not found. Please re-login.");
  }
  return user;
}
