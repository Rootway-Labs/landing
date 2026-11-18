/**
 * The client dashboard's session, set here when someone signs in or signs up.
 *
 * The landing site and the dashboard share it: set SESSION_COOKIE_DOMAIN to the
 * parent domain (for example zenerid.com) so the dashboard subdomain reads the
 * same cookie this site sets. In development both sites run on localhost, where
 * a cookie without a domain already reaches every port.
 */

import { API_URL } from "@/lib/site";

export const SESSION_COOKIE = "zenerid_session";

const DEV = process.env.NODE_ENV === "development";

export const SESSION_COOKIE_DOMAIN = process.env.SESSION_COOKIE_DOMAIN ?? undefined;

/** The Zener ID backend, where accounts live. Read on the server only. */
export const KYC_API_URL = process.env.ZENERID_API_URL ?? (DEV ? "http://localhost:8000" : API_URL);

/**
 * Whether kyc-platform still accepts a session token (GET /v1/auth/me): "ok",
 * "invalid" when it has ended or was never real, or "unavailable" when
 * kyc-platform cannot be asked, which says nothing about the token.
 */
export async function checkSession(token: string): Promise<"ok" | "invalid" | "unavailable"> {
  try {
    const response = await fetch(`${KYC_API_URL}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    // Any refusal of the request (401, 403, or the 400 production answers with
    // "That session has expired") means the token is no good; only a server error
    // or no answer at all leaves it unknown.
    if (response.status >= 400 && response.status < 500) return "invalid";
    if (!response.ok) return "unavailable";
    const account = (await response.json()) as { is_active?: boolean };
    return account.is_active === false ? "invalid" : "ok";
  } catch {
    return "unavailable";
  }
}
