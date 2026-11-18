import { cookies } from "next/headers";

import { SESSION_COOKIE, SESSION_COOKIE_DOMAIN, checkSession } from "@/lib/session";

/**
 * Whether this browser is signed in to the dashboard, for the header, which is
 * rendered the same for everyone and asks once the page has loaded. The session
 * cookie is httpOnly, so only the server can read it, and it is checked with
 * kyc-platform rather than trusted for being there: a session that has ended is
 * forgotten here, so it cannot offer a dashboard that would turn the person away.
 */
export async function GET() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const state = token ? await checkSession(token) : "invalid";
  if (token && state === "invalid") jar.delete({ name: SESSION_COOKIE, path: "/", domain: SESSION_COOKIE_DOMAIN });
  return Response.json({ signedIn: state === "ok" }, { headers: { "Cache-Control": "no-store" } });
}
