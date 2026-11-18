/**
 * What a form means when it comes back with ?error=. The codes are set by this
 * site's /api/auth/login and /api/auth/signup routes.
 */
export const AUTH_ERRORS: Record<string, string> = {
  invalid: "That email and password do not match an account.",
  exists: "An account with that email already exists. Log in instead.",
  suspended: "This account has been suspended. Contact us to find out why.",
  busy: "Too many attempts from this connection. Wait a few minutes and try again.",
  unavailable: "Signing in is not working right now. Try again in a moment.",
};

/** How each form field is named in a message. */
export const FIELD_LABELS: Record<string, string> = {
  first_name: "first name",
  last_name: "last name",
  email: "email",
  password: "password",
  country: "country",
  phone: "phone number",
  date_of_birth: "date of birth",
};

/** "Check your password and phone number.", naming every field that was refused. */
export function fieldsMessage(names: string[]) {
  const labels = names.map((name) => FIELD_LABELS[name] ?? name.replace(/_/g, " "));
  const list = labels.length > 1 ? `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}` : labels[0];
  return `Check your ${list}.`;
}

/**
 * The message for a form that came back with ?error=. A "fields" refusal names the
 * fields from ?fields= (the browser posted the form without JavaScript, so there is
 * no form state to put each reason beside its field).
 */
export function authError(code: string | string[] | undefined, fields?: string | string[]) {
  if (typeof code !== "string") return undefined;
  if (code === "fields" && typeof fields === "string" && fields) return fieldsMessage(fields.split(","));
  return AUTH_ERRORS[code] ?? AUTH_ERRORS.unavailable;
}

/** Only pass on a path inside the dashboard, never another site. */
export const safeNext = (next: string | string[] | undefined) =>
  typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : undefined;
