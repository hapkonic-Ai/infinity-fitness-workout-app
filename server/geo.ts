import { z } from "zod";
import { and, eq, gt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { GeoLock } from "@contracts/constants";
import { getDb } from "./queries/connection";
import {
  gyms,
  locationAccessSessions,
  memberProfiles,
  type Gym,
  type MemberProfile,
} from "@db/schema";
import { createRouter, authedQuery } from "./middleware";
import { initTRPC } from "@trpc/server";
import type { TrpcContext } from "./context";

// Local middleware factory bound to the same context type as the app router.
const tLocal = initTRPC.context<TrpcContext>().create();

// ---------------------------------------------------------------------------
// Haversine distance in meters
// ---------------------------------------------------------------------------
export function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function getOrAssignMembership(
  userId: number,
): Promise<{ profile: MemberProfile; gym: Gym }> {
  const db = getDb();
  let profile = await db.query.memberProfiles.findFirst({
    where: eq(memberProfiles.userId, userId),
  });
  if (!profile) {
    // First visit: assign the member to the default (first active) branch.
    const defaultGym = await db.query.gyms.findFirst({
      where: eq(gyms.active, true),
    });
    if (!defaultGym) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "NO_GYM_CONFIGURED",
      });
    }
    const [{ id }] = await db
      .insert(memberProfiles)
      .values({ userId, gymId: defaultGym.id })
      .returning();
    profile = (await db.query.memberProfiles.findFirst({
      where: eq(memberProfiles.id, id),
    }))!;
  }
  const gym = await db.query.gyms.findFirst({
    where: eq(gyms.id, profile.gymId),
  });
  if (!gym || !gym.active) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "NO_GYM_CONFIGURED",
    });
  }
  return { profile, gym };
}

/** Returns the member's currently valid location session + gym, or null. */
export async function getValidLocationSession(userId: number) {
  const db = getDb();
  const now = new Date();
  const session = await db.query.locationAccessSessions.findFirst({
    where: and(
      eq(locationAccessSessions.userId, userId),
      eq(locationAccessSessions.status, "active"),
      gt(locationAccessSessions.expiresAt, now),
    ),
  });
  if (!session) return null;
  const gym = await db.query.gyms.findFirst({
    where: eq(gyms.id, session.gymId),
  });
  if (!gym || !gym.active) return null;
  return { session, gym };
}

/**
 * Geo-fencing: member content requires a valid location authorization
 * (issued by geo.verifyLocation when the device is inside the assigned
 * gym's radius). Admins are exempt — staff must be able to manage and
 * test the fence from anywhere.
 */
const requireLocation = tLocal.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (ctx.user.role !== "admin") {
    const valid = await getValidLocationSession(ctx.user.id);
    if (!valid) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: GeoLock.lockedMessage,
      });
    }
  }
  const { gym } = await getOrAssignMembership(ctx.user.id);
  return next({
    ctx: { ...ctx, user: ctx.user, gym },
  });
});

/** Use for every API that returns member/workout content. */
export const locationProtectedQuery = authedQuery.use(requireLocation);

// ---------------------------------------------------------------------------
// Geo router — public-to-member endpoints for verification & status
// ---------------------------------------------------------------------------
export const geoRouter = createRouter({
  /** Member's assigned gym (public geo config — needed to render the lock UI). */
  myGym: authedQuery.query(async ({ ctx }) => {
    const { gym } = await getOrAssignMembership(ctx.user.id);
    return {
      id: gym.id,
      name: gym.name,
      address: gym.address,
      latitude: gym.latitude,
      longitude: gym.longitude,
      radiusMeters: gym.radiusMeters,
    };
  }),

  /** Current location authorization status (no coordinates stored). */
  status: authedQuery.query(async ({ ctx }) => {
    const valid = await getValidLocationSession(ctx.user.id);
    if (!valid) return { unlocked: false as const };
    return {
      unlocked: true as const,
      gymName: valid.gym.name,
      verifiedAt: valid.session.verifiedAt,
      expiresAt: valid.session.expiresAt,
      distanceFromGym: valid.session.distanceFromGym,
    };
  }),

  /**
   * Verify the member's current GPS position against the assigned gym's
   * geofence. On success, creates a temporary locationAccessSession.
   */
  verifyLocation: authedQuery
    .input(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        accuracy: z.number().positive().max(100000).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { gym } = await getOrAssignMembership(ctx.user.id);

      // GPS too imprecise to prove presence — never silently lock a member
      // whose fix is simply bad.
      if (input.accuracy == null || input.accuracy > GeoLock.maxAccuracyMeters) {
        return {
          result: "accuracy_poor" as const,
          gymName: gym.name,
          accuracy: input.accuracy,
        };
      }

      const distance = haversineMeters(
        input.latitude,
        input.longitude,
        gym.latitude,
        gym.longitude,
      );

      // Inside the radius, or close enough that GPS error explains the gap.
      const inside =
        distance <= gym.radiusMeters ||
        distance - input.accuracy <= gym.radiusMeters;

      if (!inside) {
        return {
          result: "outside" as const,
          gymName: gym.name,
          distance: Math.round(distance),
        };
      }

      const now = new Date();
      // Expire any previous sessions, then issue a fresh authorization.
      await db
        .update(locationAccessSessions)
        .set({ status: "expired" })
        .where(
          and(
            eq(locationAccessSessions.userId, ctx.user.id),
            eq(locationAccessSessions.status, "active"),
          ),
        );
      const [{ id }] = await db
        .insert(locationAccessSessions)
        .values({
          userId: ctx.user.id,
          gymId: gym.id,
          verifiedAt: now,
          expiresAt: new Date(now.getTime() + GeoLock.sessionTtlMs),
          status: "active",
          verificationAccuracy: input.accuracy,
          distanceFromGym: Math.round(distance),
        })
        .returning();

      return {
        result: "verified" as const,
        gymName: gym.name,
        distance: Math.round(distance),
        sessionId: id,
        expiresAt: new Date(now.getTime() + GeoLock.sessionTtlMs),
      };
    }),
});
