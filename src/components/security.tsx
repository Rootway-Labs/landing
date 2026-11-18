import { EyeOff, FileClock, History, KeyRound, LockKeyhole, UserCheck } from "lucide-react";

import { IconMark, SectionHeading } from "@/components/ui";

const MEASURES = [
  {
    icon: UserCheck,
    title: "Consent first",
    text: "Customers are told what is collected, why, and for how long, and agree before the camera opens.",
  },
  {
    icon: LockKeyhole,
    title: "Private by default",
    text: "Evidence is kept in access-controlled storage and is only shown to signed-in staff whose role allows it.",
  },
  {
    icon: History,
    title: "Everything audited",
    text: "Every request and every action in the console is recorded with who did it, when, and from where.",
  },
  {
    icon: EyeOff,
    title: "Secrets never stored in logs",
    text: "Passwords, keys and tokens are masked before anything is written, so the audit trail is safe to read.",
  },
  {
    icon: KeyRound,
    title: "Roles for every team",
    text: "Owners, administrators, compliance reviewers, support and read-only auditors each get only what their role needs.",
  },
  {
    icon: FileClock,
    title: "Links that expire",
    text: "Every verification link is single-purpose, expires on a schedule you set, and is never indexed by search engines.",
  },
];

export function Security() {
  return (
    <section id="security" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.25fr] lg:gap-20 lg:py-28">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            layout="stack"
            title="Designed with security and privacy in mind"
            lead="Identity data is the most sensitive thing your customers give you. It is handled that way at every step."
          />
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {MEASURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-5 py-7">
              <IconMark>
                <Icon className="size-5" strokeWidth={1.6} aria-hidden />
              </IconMark>
              <div>
                <h3 className="text-[19px] font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-[15.5px] leading-relaxed text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
