import { Link2, Smartphone, FileCheck2 } from "lucide-react";

import { SectionHeading } from "@/components/ui";

const STEPS = [
  {
    icon: Link2,
    title: "Create a verification",
    text: "Choose the checks you want for this customer: document, liveness, proof of address and AML. You get a link that is theirs alone.",
  },
  {
    icon: Smartphone,
    title: "They verify on their phone",
    text: "They open the link, or scan a QR code from a computer, and are guided through each step in their browser. No app to install.",
  },
  {
    icon: FileCheck2,
    title: "You get the decision",
    text: "Pass, review or fail, with the reason for each step, shown in your dashboard and sent to your system.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8 lg:py-28">
      <SectionHeading
        title="From link to decision in three steps"
        lead="Your customer never leaves a flow that feels like yours, and your team only steps in when it matters."
      />

      <ol className="relative mt-16 grid gap-10 lg:grid-cols-3 lg:gap-12">
        {/* One line runs through every step marker on wide screens. */}
        <span aria-hidden className="absolute top-6 right-0 left-0 hidden h-px bg-line lg:block" />
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="relative flex gap-5 lg:block">
            <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-line bg-white text-brand shadow-[0_0_0_8px_#fff]">
              <Icon className="size-5" strokeWidth={1.7} aria-hidden />
            </span>
            <div className="lg:mt-8">
              <p className="text-[13px] font-semibold tracking-wider text-brand uppercase">Step {i + 1}</p>
              <h3 className="mt-2 text-[22px] leading-snug font-bold text-ink">{title}</h3>
              <p className="mt-3 max-w-sm text-[15.5px] leading-relaxed text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
