export const Session = {
  cookieName: "infinity_sid",
  maxAgeMs: 365 * 24 * 60 * 60 * 1000,
} as const;

export const ErrorMessages = {
  unauthenticated: "Authentication required",
  insufficientRole: "Insufficient permissions",
} as const;

export const GeoLock = {
  /** Error message carried on every 403 response for locked content. */
  lockedMessage: "LOCATION_LOCKED",
  /** How long a verified location authorization remains valid. */
  sessionTtlMs: 15 * 60 * 1000,
  /** GPS accuracy worse than this (meters) cannot establish presence. */
  maxAccuracyMeters: 250,
} as const;

export const Paths = {
  login: "/login",
} as const;
