import { formFields, fromThisSite, kycPost, refuse, signedIn } from "@/lib/auth-form";
import { safeNext } from "@/lib/auth-errors";

/**
 * Sign in, posted from /login. Passes the email and password to kyc-platform's
 * POST /v1/auth/login and, when it answers with a token, keeps that token in
 * the shared httpOnly session cookie and opens the dashboard.
 */
export async function POST(request: Request) {
  const field = await formFields(request);
  const next = safeNext(field?.("next"));
  if (!fromThisSite(request) || !field) return refuse(request, "/login", "unavailable", next);

  const email = field("email");
  const password = field("password", { trim: false });
  if (!email || !password) {
    const fields = {
      ...(email ? {} : { email: "Enter your email address." }),
      ...(password ? {} : { password: "Enter your password." }),
    };
    return refuse(request, "/login", "fields", next, fields);
  }

  const answer = await kycPost("/v1/auth/login", { email, password });
  if (answer?.token) return signedIn(request, answer.token, next);
  // 401 is a wrong email or password, 422 an email the API cannot read: both are "do not match".
  if (answer?.status === 401 || answer?.status === 422) return refuse(request, "/login", "invalid", next);
  if (answer?.status === 403) return refuse(request, "/login", "suspended", next);
  if (answer?.status === 429) return refuse(request, "/login", "busy", next);
  return refuse(request, "/login", "unavailable", next);
}
