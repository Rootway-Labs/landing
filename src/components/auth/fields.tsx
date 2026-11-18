"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, type ComponentProps, type ReactNode } from "react";

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTROL =
  "h-12 w-full rounded-lg border border-line bg-white px-3.5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/10 aria-invalid:border-red-600 aria-invalid:focus:ring-red-600/10";

/** A labelled control with its error under it. */
export function Field({
  id,
  label,
  error,
  aside,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[14px] font-medium text-ink">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13.5px] text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ invalid, ...props }: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={CONTROL}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${props.id}-error` : undefined}
      {...props}
    />
  );
}

export function SelectInput({ invalid, ...props }: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <select
      className={`${CONTROL} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='none'%20stroke='%23687588'%20stroke-width='2'%20viewBox='0%200%2024%2024'%3E%3Cpath%20d='m6%209%206%206%206-6'/%3E%3C/svg%3E")] bg-[position:right_14px_center] bg-no-repeat pr-10`}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${props.id}-error` : undefined}
      {...props}
    />
  );
}

export function PasswordInput({ invalid, ...props }: ComponentProps<"input"> & { invalid?: boolean }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <TextInput type={shown ? "text" : "password"} invalid={invalid} {...props} className={`${CONTROL} pr-12`} />
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted hover:text-ink"
        aria-label={shown ? "Hide password" : "Show password"}
      >
        {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function SubmitButton({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-brand-deep px-6 text-[15px] font-semibold text-white transition-colors hover:bg-brand disabled:opacity-70"
    >
      {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function FormAlert({ tone = "error", children }: { tone?: "error" | "note"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={`rounded-lg px-3.5 py-3 text-[14px] ${
        tone === "error" ? "bg-red-50 text-red-700" : "bg-review-tint text-review"
      }`}
    >
      {children}
    </div>
  );
}

export type FormAnswer = { redirect?: string; error?: string; fields?: Record<string, string> };

/**
 * Send a sign-in or sign-up form to its route without leaving the page. Resolves
 * to where to go next when it worked, or to an error code from lib/auth-errors.ts,
 * with the reason for each refused field when the code is "fields".
 */
export async function sendForm(form: HTMLFormElement): Promise<FormAnswer> {
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    const answer = (await response.json()) as FormAnswer;
    return answer.redirect || answer.error ? answer : { error: "unavailable" };
  } catch {
    return { error: "unavailable" };
  }
}

/** Every flag in one file (scripts/build-flag-sprite.mjs), fetched once and cached. */
export const FLAG_SPRITE = "/flags.svg";

/** A country's flag, drawn from the one sprite, so a list of them costs a single request. */
export function Flag({ code, className = "h-3.5 w-[21px]" }: { code: string; className?: string }) {
  return (
    <svg aria-hidden className={`${className} shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(10,16,31,0.08)]`}>
      <use href={`${FLAG_SPRITE}#${code}`} width="100%" height="100%" />
    </svg>
  );
}
