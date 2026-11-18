"use client";

import { ArrowLeft } from "lucide-react";
import { useState, type FormEvent } from "react";

import { EMAIL, FLAG_SPRITE, Field, Flag, FormAlert, PasswordInput, SubmitButton, TextInput, sendForm } from "@/components/auth/fields";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { AUTH_ERRORS, fieldsMessage } from "@/lib/auth-errors";
import { DIALLING_CODES } from "@/lib/dialling-codes";

type Name = "first_name" | "last_name" | "email" | "password" | "country" | "phone" | "date_of_birth";
type Errors = Partial<Record<Name, string>>;
type Country = { code: string; name: string };

/** The two steps, each short enough to fit on the screen without scrolling. */
const STEPS: { title: string; fields: Name[] }[] = [
  { title: "Your account", fields: ["first_name", "last_name", "email", "password"] },
  { title: "Contact details", fields: ["country", "phone", "date_of_birth"] },
];

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function check(step: number, data: FormData, today: string): Errors {
  const value = (name: Name) => String(data.get(name) ?? "").trim();
  const errors: Errors = {};
  if (step === 0) {
    if (!value("first_name")) errors.first_name = "Enter your first name.";
    if (!value("last_name")) errors.last_name = "Enter your last name.";
    if (!value("email")) errors.email = "Enter your work email.";
    else if (!EMAIL.test(value("email"))) errors.email = "Enter a valid email address, like name@company.com.";
    if (String(data.get("password") ?? "").length < 12) errors.password = "Use at least 12 characters.";
  } else {
    if (!value("country")) errors.country = "Choose your country.";
    if (value("phone").replace(/\D/g, "").length < 5) errors.phone = "Enter your phone number.";
    const born = value("date_of_birth");
    if (!born) errors.date_of_birth = "Choose your date of birth.";
    else if (born >= today) errors.date_of_birth = "Choose a date in the past.";
  }
  return errors;
}

/**
 * Sign-up in two short steps, so the page never scrolls: the account itself,
 * then the contact details kyc-platform's register asks for. Every field stays
 * in the one form (the hidden step is only out of sight), and the whole form is
 * sent to this site's /api/auth/signup without leaving the page. That route
 * opens the account, sets the session cookie the dashboard shares, and answers
 * with where to go; a refusal is shown here with everything still filled in.
 */
export function SignUpForm({ countries }: { countries: Country[] }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [alert, setAlert] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [country, setCountry] = useState("");
  const [born, setBorn] = useState("");
  const [today] = useState(() => ymd(new Date()));

  // Only countries with a dialling code, since the phone number takes the country's.
  const countryOptions = countries
    .filter((c) => DIALLING_CODES[c.code])
    .map((c) => ({ value: c.code, label: c.name, icon: <Flag code={c.code} /> }));
  const dialling = DIALLING_CODES[country] ?? "";

  function showErrors(found: Errors) {
    setErrors(found);
    const first = STEPS[step].fields.find((name) => found[name]);
    if (first) document.getElementById(first)?.focus();
    return !first;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setAlert(undefined);
    if (!showErrors(check(step, new FormData(form), today))) return;
    if (step === 0) {
      setStep(1);
      return;
    }

    setBusy(true);
    const answer = await sendForm(form);
    if (answer.redirect) {
      window.location.assign(answer.redirect);
      return;
    }
    setBusy(false);
    if (answer.error === "exists") {
      // Back to the step with the email on it, and say so there.
      setStep(0);
      setErrors({ email: AUTH_ERRORS.exists });
      return;
    }
    if (answer.error === "fields" && answer.fields) {
      // Each reason beside its field, on the step that has the first of them. A
      // reason with no field on the form (or none at all) goes in the alert.
      const { form: general, ...byField } = answer.fields;
      const onForm = Object.fromEntries(
        Object.entries(byField).filter(([name]) => STEPS.some((s) => s.fields.includes(name as Name))),
      ) as Errors;
      const elsewhere = Object.keys(byField).filter((name) => !(name in onForm));
      const at = STEPS.findIndex((s) => s.fields.some((name) => onForm[name]));
      if (at >= 0) setStep(at);
      setErrors(onForm);
      if (general || elsewhere.length) setAlert(general ?? fieldsMessage(elsewhere));
      return;
    }
    setAlert(AUTH_ERRORS[answer.error ?? "unavailable"] ?? AUTH_ERRORS.unavailable);
  }

  return (
    <form noValidate method="post" action="/api/auth/signup" onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-medium text-ink">{STEPS[step].title}</span>
          <span className="text-muted">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5" aria-hidden>
          {STEPS.map((s, i) => (
            <span key={s.title} className={`h-1 rounded-full transition-colors ${i <= step ? "bg-brand" : "bg-cloud"}`} />
          ))}
        </div>
      </div>

      {alert ? <FormAlert>{alert}</FormAlert> : null}

      {/* Starts loading the flag sprite while the first step is filled in, so the
          country list opens with its flags already there. */}
      <svg aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
        <use href={`${FLAG_SPRITE}#ZA`} />
      </svg>

      <div hidden={step !== 0} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field id="first_name" label="First name" error={errors.first_name}>
            <TextInput id="first_name" name="first_name" autoComplete="given-name" placeholder="Thabo" invalid={!!errors.first_name} />
          </Field>
          <Field id="last_name" label="Last name" error={errors.last_name}>
            <TextInput id="last_name" name="last_name" autoComplete="family-name" placeholder="Nkosi" invalid={!!errors.last_name} />
          </Field>
        </div>

        <Field id="email" label="Work email" error={errors.email}>
          <TextInput id="email" name="email" type="email" autoComplete="email" placeholder="name@company.com" invalid={!!errors.email} />
        </Field>

        <Field id="password" label="Password" error={errors.password}>
          <PasswordInput id="password" name="password" autoComplete="new-password" invalid={!!errors.password} />
          {errors.password ? null : <p className="text-[13px] text-muted">At least 12 characters.</p>}
        </Field>
      </div>

      <div hidden={step !== 1} className="flex flex-col gap-4">
        <Field id="country" label="Country" error={errors.country}>
          <Combobox
            id="country"
            name="country"
            options={countryOptions}
            value={country}
            onChange={setCountry}
            placeholder="Choose your country"
            searchPlaceholder="Search countries"
            emptyText="No country matches."
            invalid={!!errors.country}
          />
        </Field>

        <Field id="phone" label="Phone number" error={errors.phone}>
          {/* The dialling code is the chosen country's, shown in front of the number and not
              editable here: choosing another country is how it changes. */}
          <div
            className={`flex h-12 items-center overflow-hidden rounded-lg border bg-white transition-[border-color,box-shadow] focus-within:ring-4 ${
              errors.phone
                ? "border-red-600 focus-within:ring-red-600/10"
                : "border-line focus-within:border-brand focus-within:ring-brand/10"
            }`}
          >
            <span
              className="flex h-full shrink-0 items-center gap-2 border-r border-line bg-mist px-3.5 text-[15px] text-ink select-none"
              title={country ? "Set by the country you chose" : "Choose your country first"}
            >
              {country ? <Flag code={country} /> : null}
              <span className={dialling ? undefined : "text-muted/70"}>{dialling || "+ ··"}</span>
            </span>
            <input type="hidden" name="dialling_code" value={dialling} />
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel-national"
              placeholder="82 123 4567"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-[15px] text-ink outline-none placeholder:text-muted/70"
            />
          </div>
        </Field>

        <Field id="date_of_birth" label="Date of birth" error={errors.date_of_birth}>
          <DatePicker
            id="date_of_birth"
            name="date_of_birth"
            value={born}
            onChange={setBorn}
            min="1900-01-01"
            max={today}
            defaultView="1990-01-01"
            placeholder="Choose your date of birth"
            invalid={!!errors.date_of_birth}
          />
        </Field>
      </div>

      <div className="flex gap-3">
        {step === 1 ? (
          <button
            type="button"
            onClick={() => {
              setErrors({});
              setAlert(undefined);
              setStep(0);
            }}
            disabled={busy}
            className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-line px-5 text-[15px] font-medium text-ink transition-colors hover:bg-mist"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </button>
        ) : null}
        <div className="flex flex-1 flex-col">
          <SubmitButton busy={busy}>{step === 0 ? "Continue" : busy ? "Creating your account" : "Create account"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}
