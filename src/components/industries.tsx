import { Bitcoin, Building2, CandlestickChart, HandCoins, ShieldPlus, Store } from "lucide-react";

import { IconMark, SectionHeading } from "@/components/ui";

const INDUSTRIES = [
  { icon: Building2, label: "Fintech and payments", text: "Onboard users in your app before money moves." },
  { icon: CandlestickChart, label: "Brokerage and trading", text: "Verify investors before their first trade." },
  { icon: Bitcoin, label: "Digital assets", text: "Verify account holders before they transact." },
  { icon: HandCoins, label: "Lending", text: "Know exactly who you are lending to." },
  { icon: ShieldPlus, label: "Insurance", text: "Confirm policyholders and claimants." },
  { icon: Store, label: "Marketplaces", text: "Keep fake and duplicate accounts out." },
];

export function Industries() {
  return (
    <section id="industries" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8 lg:py-28">
      <SectionHeading
        title="Adapts to your business"
        lead="One set of checks for every regulated industry you grow into. Pick the steps your regulator expects and leave out the rest."
      />
      <ul className="mt-14 grid overflow-hidden rounded-2xl border border-line sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map(({ icon: Icon, label, text }) => (
          <li
            key={label}
            className="-mr-px -mb-px border-r border-b border-line bg-white p-7 transition-colors hover:bg-mist"
          >
            <IconMark>
              <Icon className="size-5" strokeWidth={1.6} aria-hidden />
            </IconMark>
            <h3 className="mt-8 text-[19px] font-bold text-ink">{label}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
