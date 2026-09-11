export const LOGIN_PATH = "/login";

// Body-part session categories, in menu order.
export const GROUP_ORDER = [
  "Chest",
  "Triceps",
  "Lats",
  "Biceps",
  "Shoulders",
  "Legs",
  "Abs",
  "Cardio",
];

// Day of week (0 = Sunday) → muscle groups trained that day.
export const DAY_GROUPS: Record<number, string[]> = {
  1: ["Chest", "Triceps"],
  2: ["Lats", "Biceps"],
  3: ["Shoulders"],
  4: ["Legs", "Abs"],
  5: ["Cardio"],
};

export function todaysGroups(now = new Date()): string[] {
  return DAY_GROUPS[now.getDay()] ?? [];
}
