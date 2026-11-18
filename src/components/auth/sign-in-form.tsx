"use client";

import { Info } from "lucide-react";
import { useState, type FormEvent } from "react";

import { EMAIL, Field, FormAlert, PasswordInput, SubmitButton, TextInput, sendForm } from "@/components/auth/fields";
import { AUTH_ERRORS } from "@/lib/auth-errors";

type Errors = { email?: string; password?: string };

/**
 * Checks the fields here, then sends them to this site's /api/auth/login without
 * leaving the page. That route signs in with kyc-platform, sets the session
 * cookie the dashboard shares, and answers with the dashboard page to open (the
 * one the person was headed to, if any); a refusal is shown here, with the
 * email still filled in.
 */
export function SignInForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState<string>();
  const [reset, setReset] = useState<"closed" | "open" | "sent">("closed");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setAlert(undefined);
    const found: Errors = {};
    const typed = String(data.get("email") ?? "").trim();
    if (!typed) found.email = "Enter your email address.";
    else if (!EMAIL.test(typed)) found.email = "Enter a valid email address, like name@company.com.";
    if (!data.get("password")) found.password = "Enter your password.";
    setErrors(found);
    if (found.email || found.password) {
      document.getElementById(found.email ? "email" : "password")?.focus();
      return;
    }

    setBusy(true);
    const answer = await sendForm(form);
    if (answer.redirect) {
      window.location.assign(answer.redirect);
      return;
    }
    setBusy(false);
    if (answer.error === "fields" && answer.fields) {
      setErrors(answer.fields);
      return;
    }
    setAlert(AUTH_ERRORS[answer.error ?? "unavailable"] ?? AUTH_ERRORS.unavailable);
  }

  return (
    <form noValidate method="post" action="/api/auth/login" onSubmit={onSubmit} className="flex flex-col gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {alert ? <FormAlert>{alert}</FormAlert> : null}

      <Field id="email" label="Work email" error={errors.email}>
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          invalid={!!errors.email}
        />
      </Field>

      <Field
        id="password"
        label="Password"
        error={errors.password}
        aside={
          <button
            type="button"
            onClick={() => setReset(reset === "closed" ? "open" : "closed")}
            className="text-[14px] font-medium text-brand hover:underline"
          >
            Forgot password?
          </button>
        }
      >
        <PasswordInput id="password" name="password" autoComplete="current-password" invalid={!!errors.password} />
      </Field>

      {reset !== "closed" ? (
        <div className="flex gap-2 rounded-lg bg-brand-tint px-3.5 py-3 text-[14px] text-brand-deep">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          {reset === "sent" ? (
            <span>If that address has an account, a link to set a new password is on its way.</span>
          ) : (
            <span>
              Enter your email above, then{" "}
              <button
                type="button"
                className="font-medium underline underline-offset-2"
                onClick={() => {
                  if (!EMAIL.test(email.trim())) {
                    setErrors({ email: "Enter the email address you sign in with." });
                    document.getElementById("email")?.focus();
                    return;
                  }
                  setErrors({});
                  setReset("sent");
                }}
              >
                send me a reset link
              </button>
              .
            </span>
          )}
        </div>
      ) : null}

      <SubmitButton busy={busy}>{busy ? "Logging in" : "Log in"}</SubmitButton>
    </form>
  );
}
