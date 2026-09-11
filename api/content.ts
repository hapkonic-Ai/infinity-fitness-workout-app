import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "./queries/connection";
import {
  exercises,
  favorites,
  workoutHistory,
  workouts,
} from "@db/schema";
import { createRouter } from "./middleware";
import { locationProtectedQuery } from "./geo";

/**
 * Member workout content. Every procedure requires an authenticated
 * member; geo-fencing has been removed, so content is available anywhere.
 */
export const contentRouter = createRouter({
  exercises: createRouter({
    list: locationProtectedQuery
      .input(
        z
          .object({
            category: z
              .enum(["strength", "circuit", "cardio", "mobility"])
              .optional(),
          })
          .optional(),
      )
      .query(async ({ input, ctx }) => {
        const db = getDb();
        const rows = input?.category
          ? await db.query.exercises.findMany({
              where: eq(exercises.category, input.category),
            })
          : await db.query.exercises.findMany();
        const favs = await db.query.favorites.findMany({
          where: eq(favorites.userId, ctx.user.id),
        });
        const favSet = new Set(favs.map((f) => f.exerciseId));
        return rows.map((e) => ({ ...e, isFavorite: favSet.has(e.id) }));
      }),

    toggleFavorite: locationProtectedQuery
      .input(z.object({ exerciseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = getDb();
        const existing = await db.query.favorites.findFirst({
          where: and(
            eq(favorites.userId, ctx.user.id),
            eq(favorites.exerciseId, input.exerciseId),
          ),
        });
        if (existing) {
          await db.delete(favorites).where(eq(favorites.id, existing.id));
          return { isFavorite: false };
        }
        await db
          .insert(favorites)
          .values({ userId: ctx.user.id, exerciseId: input.exerciseId });
        return { isFavorite: true };
      }),
  }),

  workouts: createRouter({
    list: locationProtectedQuery
      .input(
        z
          .object({ type: z.enum(["workout", "circuit", "cardio"]).optional() })
          .optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        if (input?.type) {
          return db.query.workouts.findMany({
            where: eq(workouts.type, input.type),
          });
        }
        return db.query.workouts.findMany();
      }),

    detail: locationProtectedQuery
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = getDb();
        return db.query.workouts.findFirst({
          where: eq(workouts.id, input.id),
          with: {
            workoutExercises: {
              with: { exercise: true },
              orderBy: (we, { asc }) => [asc(we.orderIndex)],
            },
          },
        });
      }),

    complete: locationProtectedQuery
      .input(z.object({ workoutId: z.number(), durationMin: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = getDb();
        await db.insert(workoutHistory).values({
          userId: ctx.user.id,
          workoutId: input.workoutId,
          durationMin: input.durationMin,
        });
        return { ok: true };
      }),
  }),

  history: createRouter({
    list: locationProtectedQuery.query(async ({ ctx }) => {
      const db = getDb();
      return db.query.workoutHistory.findMany({
        where: eq(workoutHistory.userId, ctx.user.id),
        with: { workout: true },
        orderBy: [desc(workoutHistory.completedAt)],
        limit: 20,
      });
    }),
  }),

  /** Member-built sessions: pick up to 3 exercises from the exercise menu. */
  custom: createRouter({
    complete: locationProtectedQuery
      .input(
        z.object({
          exerciseIds: z.array(z.number()).min(1).max(3),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = getDb();
        await db.insert(workoutHistory).values({
          userId: ctx.user.id,
          workoutId: null,
          exerciseIds: JSON.stringify(input.exerciseIds),
        });
        return { ok: true };
      }),
  }),

  favorites: createRouter({
    list: locationProtectedQuery.query(async ({ ctx }) => {
      const db = getDb();
      const rows = await db.query.favorites.findMany({
        where: eq(favorites.userId, ctx.user.id),
        with: { exercise: true },
      });
      return rows.map((r) => r.exercise);
    }),
  }),
});
