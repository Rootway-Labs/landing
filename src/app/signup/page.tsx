import { countries as CODES } from "country-flag-icons";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthLayout } from "@/components/auth/auth-layout";
import { FormAlert } from "@/components/auth/fields";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { authError } from "@/lib/auth-errors";
import { SESSION_COOKIE, checkSession } from "@/lib/session";
import { DASHBOARD_URL, SIGN_IN_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Zener ID account to verify customers and screen them for AML risk.",
  alternates: { canonical: "/signup" },
};

/** Every ISO country, by its English name. Worked out here so the server and browser lists match. */
function countryOptions() {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  return CODES.filter((code) => /^[A-Z]{2}$/.test(code))
    .map((code) => ({ code, name: names.of(code) ?? code }))
    .filter((country) => country.name !== country.code)
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}

export default async function SignUpPage({ searchParams }: PageProps<"/signup">) {
  const { error, fields } = await searchParams;
  const message = authError(error, fields);
  // Already signed in with a session kyc-platform still accepts: nothing to sign up
  // for, so on to the dashboard.
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!message && token && (await checkSession(token)) === "ok") redirect(DASHBOARD_URL);

  return (
    <AuthLayout
      switcher={
        <>
          Already have an account?{" "}
          <Link href={SIGN_IN_HREF} className="font-medium text-brand hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <h1 className="text-[32px] leading-tight font-bold text-ink">Create your account</h1>
      <p className="mt-2 text-[15.5px] text-muted">Your dashboard is ready as soon as you sign up.</p>
      <div className="mt-6 flex flex-col gap-5">
        {message ? <FormAlert>{message}</FormAlert> : null}
        <SignUpForm countries={countryOptions()} />
      </div>
    </AuthLayout>
  );
}
