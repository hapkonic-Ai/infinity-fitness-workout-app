import { relations } from "drizzle-orm";
import {
  users,
  gyms,
  memberProfiles,
  locationAccessSessions,
  exercises,
  workouts,
  workoutExercises,
  favorites,
  workoutHistory,
} from "./schema";

export const gymsRelations = relations(gyms, ({ many }) => ({
  members: many(memberProfiles),
}));

export const memberProfilesRelations = relations(memberProfiles, ({ one }) => ({
  user: one(users, {
    fields: [memberProfiles.userId],
    references: [users.id],
  }),
  gym: one(gyms, {
    fields: [memberProfiles.gymId],
    references: [gyms.id],
  }),
}));

export const locationAccessSessionsRelations = relations(
  locationAccessSessions,
  ({ one }) => ({
    user: one(users, {
      fields: [locationAccessSessions.userId],
      references: [users.id],
    }),
    gym: one(gyms, {
      fields: [locationAccessSessions.gymId],
      references: [gyms.id],
    }),
  }),
);

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
  }),
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  exercise: one(exercises, {
    fields: [favorites.exerciseId],
    references: [exercises.id],
  }),
}));

export const workoutHistoryRelations = relations(workoutHistory, ({ one }) => ({
  user: one(users, { fields: [workoutHistory.userId], references: [users.id] }),
  workout: one(workouts, {
    fields: [workoutHistory.workoutId],
    references: [workouts.id],
  }),
}));
