"use client";

import { Check, FileText, Fingerprint, House, ScanFace, ShieldCheck } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Grain } from "@/components/brand/grain";
import { SectionHeading } from "@/components/ui";

function Tick({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-line py-3 text-[14px] last:border-0">
      <span className="text-body">{children}</span>
      <span className="inline-flex items-center gap-1 rounded-full bg-pass-tint px-2.5 py-1 text-[12px] font-medium text-pass">
        <Check className="size-3.5" aria-hidden />
        Passed
      </span>
    </li>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex h-full items-center justify-center overflow-hidden rounded-3xl bg-brand-light p-6 sm:p-10">
      <Grain tone="light" opacity={0.14} />
      <div className="relative w-full max-w-[400px] rounded-2xl bg-white p-5 shadow-[0_24px_60px_-28px_rgba(6,48,43,0.4)] ring-1 ring-black/5">
        {children}
      </div>
    </div>
  );
}

function DocumentVisual() {
  return (
    <Panel>
      <div className="relative overflow-hidden rounded-xl bg-brand-deep p-4 text-white">
        <div className="flex gap-3">
          <div className="h-[74px] w-[58px] rounded-md bg-white/20" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <span className="h-2 w-3/4 rounded bg-white/50" />
            <span className="h-2 w-1/2 rounded bg-white/35" />
            <span className="h-2 w-2/3 rounded bg-white/35" />
            <span className="h-2 w-2/5 rounded bg-white/35" />
          </div>
        </div>
        <p className="mt-3 font-mono text-[9.5px] leading-tight tracking-wider text-white/60">
          P&lt;GHAMENSAH&lt;&lt;EFUA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          <br />
          G0123456&lt;7GHA9001015F3001014&lt;&lt;&lt;
        </p>
        <span className="animate-scan absolute inset-x-0 h-px bg-brand-sky shadow-[0_0_12px_2px_rgba(47,224,168,0.8)]" />
      </div>
      <ul className="mt-3">
        <Tick>Machine-readable zone is valid</Tick>
        <Tick>Document has not expired</Tick>
        <Tick>Photo has not been edited</Tick>
      </ul>
    </Panel>
  );
}

function FaceVisual() {
  return (
    <Panel>
      <div className="flex items-center justify-center py-3">
        <div className="relative grid size-36 place-items-center rounded-full border-2 border-dashed border-brand/40">
          <div className="grid size-28 place-items-center rounded-full bg-brand-tint text-brand">
            <ScanFace className="size-14" strokeWidth={1.2} aria-hidden />
          </div>
          <span className="absolute -right-1 top-3 grid size-7 place-items-center rounded-full bg-pass text-white">
            <Check className="size-4" aria-hidden />
          </span>
        </div>
      </div>
      <div className="mt-2 flex justify-center gap-2">
        {["Turn left", "Turn right", "Look ahead"].map((move) => (
          <span key={move} className="rounded-full bg-cloud px-3 py-1 text-[12px] text-body">
            {move}
          </span>
        ))}
      </div>
      <ul className="mt-3">
        <Tick>A live person, not a photo or a screen</Tick>
        <Tick>Same face as the document</Tick>
      </ul>
    </Panel>
  );
}

function AddressVisual() {
  return (
    <Panel>
      <div className="rounded-xl border border-line p-4">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-ink">Electricity bill</span>
          <span className="text-[11px] text-muted">Issued 3 weeks ago</span>
        </div>
        <div className="mt-3 space-y-1.5 text-[13px]">
          <p className="rounded bg-brand-tint px-2 py-1 text-brand">KG 11 Avenue, 24</p>
          <p className="rounded bg-brand-tint px-2 py-1 text-brand">Kigali</p>
          <p className="rounded bg-brand-tint px-2 py-1 text-brand">Rwanda</p>
        </div>
        <div className="mt-3 space-y-1.5">
          <span className="block h-2 w-full rounded bg-cloud" />
          <span className="block h-2 w-4/5 rounded bg-cloud" />
        </div>
      </div>
      <ul className="mt-3">
        <Tick>Street matches</Tick>
        <Tick>City and country match</Tick>
      </ul>
    </Panel>
  );
}

function AmlVisual() {
  return (
    <Panel>
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-brand-tint text-[14px] font-medium text-brand">
          EM
        </span>
        <div>
          <p className="text-[14px] font-medium text-ink">Efua Mensah</p>
          <p className="text-[12px] text-muted">Born 1 January 1990, Ghana</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-pass-tint px-4 py-3 text-[13px] font-medium text-pass">
        No matches found
      </div>
      <ul className="mt-3">
        <Tick>Sanctions lists</Tick>
        <Tick>Politically exposed persons</Tick>
        <Tick>Watchlists and adverse media</Tick>
      </ul>
    </Panel>
  );
}

function DeepfakeVisual() {
  return (
    <Panel>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Live capture", ok: true },
          { label: "Face swap attempt", ok: false },
        ].map(({ label, ok }) => (
          <div key={label} className="rounded-xl border border-line p-3">
            <div className="relative grid aspect-square place-items-center overflow-hidden rounded-lg bg-brand-tint text-brand">
              <ScanFace className="size-12" strokeWidth={1.2} aria-hidden />
              {!ok && <span className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(6,48,43,0.08)_0_2px,transparent_2px_6px)]" />}
            </div>
            <p className="mt-2 text-[12.5px] text-body">{label}</p>
            <p className={`text-[12px] font-medium ${ok ? "text-pass" : "text-red-600"}`}>
              {ok ? "Real person" : "Flagged as synthetic"}
            </p>
          </div>
        ))}
      </div>
      <ul className="mt-3">
        <Tick>No signs of face swapping</Tick>
        <Tick>Not generated by software</Tick>
      </ul>
    </Panel>
  );
}

const CHECKS = [
  {
    id: "document",
    label: "Identity document",
    icon: FileText,
    title: "Read and check the document itself",
    text: "The customer photographs their identity document. We read the details, check the machine-readable zone, the dates and the photo, and flag images that were edited.",
    points: ["Passports", "National ID cards", "Driving licences", "Edited image detection"],
    visual: <DocumentVisual />,
  },
  {
    id: "face",
    label: "Liveness and face match",
    icon: ScanFace,
    title: "Know a real person is there",
    text: "A short guided movement check proves a live person is in front of the camera, not a printed photo or a screen, and their face is matched against the photo on their document.",
    points: ["Guided movement check", "Face match to document", "Photo and screen detection"],
    visual: <FaceVisual />,
  },
  {
    id: "deepfake",
    label: "Deepfake detection",
    icon: Fingerprint,
    title: "Catch faces made by software",
    text: "Deepfakes and face swaps can fool a person looking at a screen. Every selfie and ID photo is checked for signs that it was generated, swapped or edited.",
    points: ["Face swap detection", "Generated face detection", "Edited photo detection"],
    visual: <DeepfakeVisual />,
  },
  {
    id: "address",
    label: "Proof of address",
    icon: House,
    title: "Confirm where they live",
    text: "The customer uploads a recent bill or bank statement. We read the address from it and match the street, city and country against the address you have on file.",
    points: ["Utility bills", "Bank statements", "Street, city and country matching"],
    visual: <AddressVisual />,
  },
  {
    id: "aml",
    label: "AML screening",
    icon: ShieldCheck,
    title: "Screen against sanctions and PEP lists",
    text: "Once the identity is confirmed, the verified name and date of birth are screened against international sanctions, politically exposed persons and watchlists. Any match comes with the full record and the reasons for listing.",
    points: ["Sanctions", "Politically exposed persons", "Watchlists", "Adverse media", "Ongoing monitoring"],
    visual: <AmlVisual />,
  },
];

export function Checks() {
  const [active, setActive] = useState(CHECKS[0].id);
  const check = CHECKS.find((c) => c.id === active) ?? CHECKS[0];

  return (
    <section id="product" className="scroll-mt-20 border-y border-line bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title="Every check you need, in one flow"
          lead="Pick the checks each customer goes through. They all run in the same link, in the order you set."
        />

        <div
          role="tablist"
          aria-label="Checks"
          className="mt-12 flex gap-8 overflow-x-auto border-b border-line [scrollbar-width:none]"
        >
          {CHECKS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              type="button"
              id={`tab-${id}`}
              aria-selected={active === id}
              aria-controls={`panel-${id}`}
              onClick={() => setActive(id)}
              className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 pb-4 text-[15px] font-medium transition-colors ${
                active === id ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <Icon className="size-4" strokeWidth={1.8} aria-hidden />
              {label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${check.id}`}
          aria-labelledby={`tab-${check.id}`}
          className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
        >
          <div key={check.id} className="animate-fade-up flex flex-col justify-center lg:py-10">
            <h3 className="text-[28px] leading-tight font-bold text-ink sm:text-[34px]">{check.title}</h3>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">{check.text}</p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {check.points.map((point) => (
                <li key={point} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13.5px] text-body">
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div key={`${check.id}-visual`} className="animate-fade-up min-h-[380px]">
            {check.visual}
          </div>
        </div>
      </div>
    </section>
  );
}
