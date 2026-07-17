// Small helper to mirror the logged-in user's role into a plain
// (non-httpOnly) cookie, so middleware.js — which runs on the
// server/edge and cannot read localStorage — can gate dashboard
// routes before a page ever renders.
//
// NOTE: this is a UX-level route gate only. It stops a user from
// briefly seeing a page they shouldn't. It is NOT the real security
// boundary — the backend must keep validating the Bearer token on
// every API call regardless of what this cookie says.

const COOKIE_NAME = "role";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days, matches typical session length

export function setAuthCookie(role) {
  if (typeof document === "undefined" || !role) return;
  document.cookie = `${COOKIE_NAME}=${role}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}
