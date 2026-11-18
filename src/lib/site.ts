/** Where things live, stated once so every link on the page agrees. */
export const PRODUCT = "Zener ID";
export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenerid.com";

/** The API clients call. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.zenerid.com";

/**
 * The client dashboard. Clients sign in and sign up on this site, which sets the
 * session cookie the two share (lib/session.ts) and then sends them here.
 */
export const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:4504" : "https://dashboard.zenerid.com");
export const SIGN_IN_HREF = "/login";
export const SIGN_UP_HREF = "/signup";

/** Where "Contact sales" writes to. */
export const CONTACT_EMAIL = "hello@zenerid.com";
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Zener ID")}`;

export const PRIVACY_URL = "/privacy";
export const TERMS_URL = "/terms";
