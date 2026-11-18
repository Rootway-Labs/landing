import { SectionHeading } from "@/components/ui";

const BENEFITS = [
  {
    title: "Documents from anywhere",
    text: "Identity documents are read from the photo and checked against their own rules, so customers verify with what they already carry.",
  },
  {
    title: "Stop fraud at the door",
    text: "Liveness, face matching and deepfake detection catch the attempts a person looking at a photo would miss.",
  },
  {
    title: "Less manual review",
    text: "Clear cases are decided automatically. Only the ones that genuinely need a person reach your team, with the reasons shown.",
  },
  {
    title: "One place to work from",
    text: "Verifications, evidence, AML results and an audit trail, in one dashboard your compliance team can rely on.",
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
      <SectionHeading
        title="Built to stop fraud, not your customers"
        lead="Real people get through in one short flow. Stolen documents, borrowed selfies and deepfakes do not."
      />
      <ol className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map(({ title, text }, i) => (
          <li key={title} className="border-t border-line pt-6 pb-8 sm:pb-0">
            <span className="font-display text-[13px] font-semibold tracking-wider text-brand tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-[20px] leading-snug font-bold text-ink">{title}</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
