import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthLayout } from "@/components/auth/auth-layout";
import { FormAlert } from "@/components/auth/fields";
import { SignInForm } from "@/components/auth/sign-in-form";
import { authError, safeNext } from "@/lib/auth-errors";
import { SESSION_COOKIE, checkSession } from "@/lib/session";
import { DASHBOARD_URL, SIGN_UP_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Zener ID dashboard.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default async function SignInPage({ searchParams }: PageProps<"/login">) {
  const { error, expired, next, fields } = await searchParams;
  const message = authError(error, fields);
  // Already signed in with a session kyc-platform still accepts: straight on to the
  // dashboard. An old or ended session just leaves the form here to sign in again.
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!message && !expired && token && (await checkSession(token)) === "ok") {
    redirect(new URL(safeNext(next) ?? "/", DASHBOARD_URL).toString());
  }

  return (
    <AuthLayout
      switcher={
        <>
          New to Zener ID?{" "}
          <Link href={SIGN_UP_HREF} className="font-medium text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <h1 className="text-[32px] leading-tight font-bold text-ink">Log in</h1>
      <p className="mt-2 text-[15.5px] text-muted">Log in to your Zener ID dashboard.</p>
      <div className="mt-8 flex flex-col gap-5">
        {message ? <FormAlert>{message}</FormAlert> : null}
        {!message && expired ? <FormAlert tone="note">Your session has ended. Log in again to carry on.</FormAlert> : null}
        <SignInForm next={safeNext(next)} />
      </div>
    </AuthLayout>
  );
}
