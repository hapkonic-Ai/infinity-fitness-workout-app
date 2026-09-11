import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "./queries/connection";
import { gyms, locationAccessSessions, memberProfiles } from "@db/schema";
import { createRouter, adminQuery } from "./middleware";
import { haversineMeters } from "./geo";

/**
 * Admin system — geo-fence configuration lives here, never in the frontend.
 * Admin endpoints require the admin role but are intentionally NOT
 * location-gated, so the fence can always be fixed from anywhere.
 */
const gymInput = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusMeters: z.number().int().min(10).max(5000),
  active: z.boolean(),
});

export const adminRouter = createRouter({
  gyms: createRouter({
    list: adminQuery.query(() => getDb().query.gyms.findMany()),

    create: adminQuery.input(gymInput).mutation(async ({ input }) => {
      const [{ id }] = await getDb().insert(gyms).values(input).returning();
      return getDb().query.gyms.findFirst({ where: eq(gyms.id, id) });
    }),

    update: adminQuery
      .input(z.object({ id: z.number(), data: gymInput }))
      .mutation(async ({ input }) => {
        await getDb()
          .update(gyms)
          .set(input.data)
          .where(eq(gyms.id, input.id));
        return getDb().query.gyms.findFirst({ where: eq(gyms.id, input.id) });
      }),
  }),

  members: createRouter({
    list: adminQuery.query(() =>
      getDb().query.memberProfiles.findMany({
        with: { user: true, gym: true },
      }),
    ),

    assignGym: adminQuery
      .input(z.object({ userId: z.number(), gymId: z.number() }))
      .mutation(async ({ input }) => {
        const db = getDb();
        const existing = await db.query.memberProfiles.findFirst({
          where: eq(memberProfiles.userId, input.userId),
        });
        if (existing) {
          await db
            .update(memberProfiles)
            .set({ gymId: input.gymId })
            .where(eq(memberProfiles.id, existing.id));
        } else {
          await db.insert(memberProfiles).values(input);
        }
        return { ok: true };
      }),
  }),

  /** Recent location verifications — audit presence events, not tracking. */
  locationSessions: createRouter({
    recent: adminQuery.query(() =>
      getDb().query.locationAccessSessions.findMany({
        orderBy: [desc(locationAccessSessions.verifiedAt)],
        limit: 50,
      }),
    ),

    /** Immediately expire a member's active location session. */
    revoke: adminQuery
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        await getDb()
          .update(locationAccessSessions)
          .set({ status: "expired" })
          .where(
            and(
              eq(locationAccessSessions.userId, input.userId),
              eq(locationAccessSessions.status, "active"),
            ),
          );
        return { ok: true };
      }),
  }),

  /**
   * Test tool: measure any coordinates against a branch fence without
   * creating a session. Lets admins verify inside/outside behavior from
   * anywhere.
   */
  geofenceTest: adminQuery
    .input(
      z.object({
        gymId: z.number(),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        accuracy: z.number().positive().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const gym = await getDb().query.gyms.findFirst({
        where: eq(gyms.id, input.gymId),
      });
      if (!gym) throw new Error("Gym not found");
      const distance = haversineMeters(
        input.latitude,
        input.longitude,
        gym.latitude,
        gym.longitude,
      );
      const inside =
        distance <= gym.radiusMeters ||
        (input.accuracy != null && distance - input.accuracy <= gym.radiusMeters);
      return {
        inside,
        distance: Math.round(distance),
        radiusMeters: gym.radiusMeters,
        gymName: gym.name,
      };
    }),
});
