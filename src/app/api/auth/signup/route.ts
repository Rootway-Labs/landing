import { apiFieldErrors, formFields, fromThisSite, kycPost, refuse, signedIn, type FieldErrors } from "@/lib/auth-form";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// kyc-platform's MIN_PASSWORD_LENGTH. It also refuses leaked passwords, which only it can tell.
const MIN_PASSWORD = 12;

/**
 * Create an account, posted from /signup. Passes the details to kyc-platform's
 * POST /v1/auth/register, which opens the account and signs it in at once, then
 * keeps the token in the shared httpOnly session cookie and opens the dashboard.
 */
export async function POST(request: Request) {
  const field = await formFields(request);
  if (!fromThisSite(request) || !field) return refuse(request, "/signup", "unavailable");

  const code = field("country");
  const country = /^[A-Z]{2}$/.test(code) ? new Intl.DisplayNames(["en"], { type: "region" }).of(code) : undefined;
  const body = {
    first_name: field("first_name"),
    last_name: field("last_name"),
    email: field("email"),
    country_code: field("dialling_code"),
    phone: field("phone"),
    date_of_birth: field("date_of_birth"),
    country,
    password: field("password", { trim: false }),
  };

  // The same checks the form makes, with the same words, for a form posted without them.
  const wrong: FieldErrors = {};
  if (!body.first_name) wrong.first_name = "Enter your first name.";
  if (!body.last_name) wrong.last_name = "Enter your last name.";
  if (!EMAIL.test(body.email)) wrong.email = "Enter a valid email address, like name@company.com.";
  if (body.password.length < MIN_PASSWORD) wrong.password = `Use at least ${MIN_PASSWORD} characters.`;
  if (!country) wrong.country = "Choose your country.";
  if (!/^\+\d{1,4}$/.test(body.country_code) || body.phone.replace(/\D/g, "").length < 5)
    wrong.phone = "Enter your phone number.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date_of_birth)) wrong.date_of_birth = "Choose your date of birth.";
  if (Object.keys(wrong).length) return refuse(request, "/signup", "fields", undefined, wrong);

  const answer = await kycPost("/v1/auth/register", body);
  if (answer?.token) return signedIn(request, answer.token);
  if (answer?.status === 409) return refuse(request, "/signup", "exists");
  if (answer?.status === 429) return refuse(request, "/signup", "busy");
  if (answer?.status === 422) {
    const fields = apiFieldErrors(answer.detail);
    if (Object.keys(fields).length) return refuse(request, "/signup", "fields", undefined, fields);
  }
  return refuse(request, "/signup", "unavailable");
}
