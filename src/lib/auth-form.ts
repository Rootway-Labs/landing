import { NextResponse } from "next/server";

import { KYC_API_URL, SESSION_COOKIE, SESSION_COOKIE_DOMAIN } from "@/lib/session";
import { DASHBOARD_URL } from "@/lib/site";

/**
 * The sign-in and sign-up forms post here. The forms send them with fetch and
 * ask for JSON, so a refusal is shown in place without reloading the page:
 * { redirect } when it works (the session cookie is already set by then), and
 * { error } with a code from lib/auth-errors.ts when it does not. A refusal of
 * particular fields is { error: "fields", fields: { name: reason } }, so each
 * reason is shown beside its field. Without
 * JavaScript the browser posts the form itself, and gets 303 redirects instead:
 * on to the dashboard, or back to the form with ?error=.
 */

export const wantsJson = (request: Request) => request.headers.get("accept")?.includes("application/json") ?? false;

/** Only this site's own forms may post here. */
export function fromThisSite(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  return new URL(origin).host === host;
}

/** The form's fields, or null when the body is not a form. Passwords are read untrimmed. */
export async function formFields(request: Request) {
  try {
    const data = await request.formData();
    return (name: string, { trim = true } = {}) => {
      const value = data.get(name);
      if (typeof value !== "string") return "";
      return trim ? value.trim() : value;
    };
  } catch {
    return null;
  }
}

export type FieldErrors = Record<string, string>;

/**
 * Turn the person away with an error code: as JSON, or back to the form. A relative
 * Location, so it works behind any proxy. With `fields`, the error is "fields" and
 * says which fields and why; only the names go in the URL, never what was typed.
 */
export function refuse(request: Request, path: "/login" | "/signup", error: string, next?: string, fields?: FieldErrors) {
  if (wantsJson(request)) return Response.json(fields ? { error, fields } : { error }, { status: 400 });
  const query = new URLSearchParams({ error });
  if (fields) query.set("fields", Object.keys(fields).join(","));
  if (next) query.set("next", next);
  return new Response(null, { status: 303, headers: { Location: `${path}?${query}` } });
}

type TokenResponse = { access_token: string; expires_in: number };
type ApiError = { detail?: unknown };

/** kyc-platform's field names where they differ from the form's. */
const API_FIELDS: Record<string, string> = { country_code: "phone" };

/**
 * What kyc-platform said was wrong, field by field, out of a 422. FastAPI lists
 * each problem as { loc: ["body", field], msg }; pydantic starts a custom
 * validator's message with "Value error, ", which is dropped. A plain-string
 * detail has no field, so it is kept under "form".
 */
export function apiFieldErrors(detail: unknown): FieldErrors {
  if (typeof detail === "string" && detail) return { form: detail };
  if (!Array.isArray(detail)) return {};
  const errors: FieldErrors = {};
  for (const item of detail as { loc?: unknown[]; msg?: string }[]) {
    const raw = String(item.loc?.at(-1) ?? "form");
    const name = API_FIELDS[raw] ?? raw;
    const message = String(item.msg ?? "").replace(/^Value error, /, "");
    if (message && !errors[name]) errors[name] = message.charAt(0).toUpperCase() + message.slice(1);
  }
  return errors;
}

/** POST a JSON body to kyc-platform. Resolves to null when it cannot be reached. */
export async function kycPost(path: string, body: unknown) {
  try {
    const response = await fetch(`${KYC_API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = (await response.json().catch(() => null)) as (TokenResponse & ApiError) | null;
    return { status: response.status, token: response.ok ? data : null, detail: response.ok ? undefined : data?.detail };
  } catch {
    return null;
  }
}

/** Set the shared session cookie and open the dashboard, on the page asked for if there was one. */
export function signedIn(request: Request, { access_token, expires_in }: TokenResponse, next = "/") {
  const destination = new URL(next, DASHBOARD_URL).toString();
  const response = wantsJson(request)
    ? NextResponse.json({ redirect: destination })
    : NextResponse.redirect(destination, 303);
  response.cookies.set(SESSION_COOKIE, access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expires_in,
    domain: SESSION_COOKIE_DOMAIN,
  });
  return response;
}
