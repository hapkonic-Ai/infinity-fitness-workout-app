const KEY = "manual-logout";

/**
 * Shared-gym mode auto-signs members in when there is no session. An explicit
 * sign-out sets this flag so AutoAuth stays quiet until the next manual
 * sign-in from /login.
 */
export function flagManualLogout() {
  sessionStorage.setItem(KEY, "1");
}

export function clearManualLogout() {
  sessionStorage.removeItem(KEY);
}

export function hasManualLogout() {
  return sessionStorage.getItem(KEY) === "1";
}
