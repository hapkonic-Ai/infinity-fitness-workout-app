import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  doublePrecision,
  boolean,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const membershipStatusEnum = pgEnum("membershipStatus", [
  "active",
  "suspended",
]);
export const sessionStatusEnum = pgEnum("status", [
  "active",
  "expired",
  "revoked",
]);
export const categoryEnum = pgEnum("category", [
  "strength",
  "circuit",
  "cardio",
  "mobility",
]);
export const difficultyEnum = pgEnum("difficulty", [
  "beginner",
  "intermediate",
  "advanced",
]);
export const workoutTypeEnum = pgEnum("type", ["workout", "circuit", "cardio"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ---------------------------------------------------------------------------
// Infinity Fitness — geo-locked gym application
// ---------------------------------------------------------------------------

// Gym branches with geo-fence configuration (managed via the admin system,
// never hard-coded into the frontend).
export const gyms = pgTable("gyms", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 512 }),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  radiusMeters: integer("radiusMeters").notNull().default(100),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Gym = typeof gyms.$inferSelect;
export type InsertGym = typeof gyms.$inferInsert;

// Member profile — assigns each user to a gym branch.
export const memberProfiles = pgTable("member_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique(),
  gymId: integer("gymId").notNull(),
  membershipStatus: membershipStatusEnum("membershipStatus")
    .notNull()
    .default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MemberProfile = typeof memberProfiles.$inferSelect;

// Temporary location authorization sessions. Proves current physical
// presence — NOT a location history. Old sessions are expired, precise
// coordinates are never stored.
export const locationAccessSessions = pgTable("location_access_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  gymId: integer("gymId").notNull(),
  verifiedAt: timestamp("verifiedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  status: sessionStatusEnum("status").notNull().default("active"),
  verificationAccuracy: doublePrecision("verificationAccuracy"),
  distanceFromGym: doublePrecision("distanceFromGym"),
});

export type LocationAccessSession = typeof locationAccessSessions.$inferSelect;

// Protected workout content — only served while a valid location
// authorization session exists.
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: categoryEnum("category").notNull(),
  muscleGroup: varchar("muscleGroup", { length: 128 }),
  description: text("description"),
  videoUrl: varchar("videoUrl", { length: 512 }),
  difficulty: difficultyEnum("difficulty").notNull().default("beginner"),
  sets: integer("sets"),
  reps: varchar("reps", { length: 64 }),
  durationSec: integer("durationSec"),
  // JSON string array of step-by-step instructions.
  instructions: text("instructions"),
  // JSON string array of common mistakes to avoid.
  mistakes: text("mistakes"),
});

export type Exercise = typeof exercises.$inferSelect;

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: workoutTypeEnum("type").notNull(),
  description: text("description"),
  focus: varchar("focus", { length: 128 }),
  durationMin: integer("durationMin").notNull().default(30),
  difficulty: difficultyEnum("difficulty").notNull().default("beginner"),
});

export type Workout = typeof workouts.$inferSelect;

export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workoutId").notNull(),
  exerciseId: integer("exerciseId").notNull(),
  orderIndex: integer("orderIndex").notNull().default(0),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  exerciseId: integer("exerciseId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const workoutHistory = pgTable("workout_history", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  // Null for custom member-built sessions (picked from the exercise menu).
  workoutId: integer("workoutId"),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  durationMin: integer("durationMin"),
  // JSON array of exercise ids, set for custom sessions.
  exerciseIds: text("exerciseIds"),
});
