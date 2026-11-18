import { Plus } from "lucide-react";

import { SectionHeading } from "@/components/ui";
import { CONTACT_EMAIL, CONTACT_HREF } from "@/lib/site";

export const QUESTIONS = [
  {
    q: "What is KYC?",
    a: "Know Your Customer is the process regulated businesses use to confirm that a customer is who they say they are before serving them. It usually means checking an identity document, confirming the person is present, and screening them against sanctions and politically exposed persons lists.",
  },
  {
    q: "Which documents can customers use?",
    a: "Government-issued identity documents such as passports, national ID cards and driving licences. For proof of address, a recent utility bill or bank statement.",
  },
  {
    q: "Does my customer need to install an app?",
    a: "No. The verification runs in the phone's browser from the link you send. If they open it on a computer, they are shown a QR code to carry on with their phone's camera.",
  },
  {
    q: "What happens when a check is not clear-cut?",
    a: "The verification is marked for review instead of being failed, with the reasons. A compliance reviewer on your team sees the evidence side by side in the console and makes the call. Every decision is recorded.",
  },
  {
    q: "How does AML screening work?",
    a: "Once the document and face checks pass, the verified name and date of birth are screened against international sanctions, politically exposed persons, watchlists and adverse media. Any possible match comes with the full record and the reasons for listing, and customers can be re-screened over time.",
  },
  {
    q: "How do you detect deepfakes?",
    a: "Every selfie and ID photo is checked for signs that the face was generated, swapped or edited by software, alongside the liveness check that confirms a real person is in front of the camera.",
  },
  {
    q: "How do we integrate?",
    a: "Create a verification from your dashboard or your own system, send the customer the link, and receive the result in the dashboard and in your system.",
  },
  {
    q: "How long is personal data kept?",
    a: "Each kind of evidence has a stated retention period, shown to the customer before they start and set out in the privacy notice. Verification links themselves expire on the schedule you choose.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-mist py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[360px_1fr] lg:gap-16">
        <div>
          <SectionHeading layout="stack" title="Frequently asked questions" />
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Something else on your mind? Write to{" "}
            <a href={CONTACT_HREF} className="text-brand hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>

        <div className="divide-y divide-line rounded-2xl border border-line bg-white">
          {QUESTIONS.map(({ q, a }) => (
            <details key={q} className="group px-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-semibold text-ink">
                {q}
                <Plus
                  className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45 group-open:text-brand"
                  aria-hidden
                />
              </summary>
              <p className="-mt-1 pb-6 pr-8 text-[15.5px] leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
