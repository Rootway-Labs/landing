"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";

import { Grain } from "@/components/brand/grain";
import { MapGlobe } from "@/components/verification-reel/map-globe";
import { PEOPLE, STEP_MS, type Person } from "@/components/verification-reel/people";

/**
 * When, within each step, the row has slid over, the scan ring fills, and the
 * passed face shrinks away before the next one slides in. Set as shares of a
 * step so they keep pace with STEP_MS.
 */
const SLIDE_MS = STEP_MS * 0.28;
const SCAN_DELAY_MS = STEP_MS * 0.2;
const SCAN_MS = STEP_MS * 0.3;
const VERIFIED_AT_MS = SCAN_DELAY_MS + SCAN_MS;
const LEAVE_DELAY_MS = STEP_MS * 0.62;
const LEAVE_MS = STEP_MS * 0.3;

const TIMINGS = {
  "--scan-ms": `${SCAN_MS}ms`,
  "--scan-delay": `${SCAN_DELAY_MS}ms`,
  "--leave-ms": `${LEAVE_MS}ms`,
  "--leave-delay": `${LEAVE_DELAY_MS}ms`,
} as CSSProperties;

/** Faces either side of the middle one. One more each side slides in and out of view. */
const SIDE = 2;
const SLOTS = SIDE * 2 + 1;
/** How many pins stay on the globe, the newest last. */
const PINS = 3;

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * The hero visual: customers slide through a card in the middle, where each one's
 * face is scanned and verified, while the globe below turns to their country and
 * pins them there. Who appears is set in ./people.ts.
 */
export function VerificationReel({ people = PEOPLE }: { people?: Person[] }) {
  // `step` counts up forever; the person in the middle is step mod people.length.
  const [step, setStep] = useState(0);
  const [passedStep, setPassedStep] = useState(-1);
  const still = useReducedMotion();
  const verified = still || passedStep === step;

  useEffect(() => {
    if (still) return;
    const pass = setTimeout(() => setPassedStep(step), VERIFIED_AT_MS);
    const next = setTimeout(() => setStep(step + 1), STEP_MS);
    return () => {
      clearTimeout(pass);
      clearTimeout(next);
    };
  }, [step, still]);

  const n = people.length;
  const active = mod(step, n);
  const current = people[active];

  // The last few people verified, oldest first, ending with the current one once it passes.
  const pinned: number[] = [];
  for (let k = step - PINS + (verified ? 1 : 0); k <= step - (verified ? 0 : 1); k++) {
    if (k >= 0) pinned.push(mod(k, n));
  }

  const slots: number[] = [];
  for (let k = step - SIDE - 1; k <= step + SIDE + 1; k++) slots.push(k);

  return (
    <div
      role="img"
      aria-label="Customers from South Africa, Kenya, Rwanda, Ghana, Uganda and Ethiopia having their faces verified one by one, each pinned on a globe once they pass"
      className="relative aspect-[6/5] w-full overflow-hidden rounded-[2cqw] bg-brand-tint [container-type:inline-size]"
      style={TIMINGS}
    >
      <div aria-hidden className="absolute inset-0">
        <Grain tone="light" opacity={0.12} />

        {/* The card in the middle stays put while faces slide through it. It runs down behind the globe, so the globe rests on it. */}
        <div className="absolute left-1/2 top-[8%] h-[56%] w-[calc(100%/5+4cqw)] -translate-x-1/2 rounded-t-[3cqw] bg-white shadow-[0_-12px_40px_-20px_rgba(6,48,43,0.25)]" />

        {/* The globe sits under the row, cut off by the panel's bottom edge. */}
        <div className="absolute inset-x-0 bottom-0 top-[52%]">
          <MapGlobe people={people} active={active} verified={verified} pinned={pinned} still={still} />
        </div>

        {slots.map((k) => {
          const offset = k - step;
          const person = people[mod(k, n)];
          return (
            <Face
              key={k}
              person={person}
              offset={offset}
              centred={offset === 0}
              still={still}
            />
          );
        })}

        {/* The scan ring belongs to the card, so it is drawn once, over whoever is in the middle. */}
        <ScanRing key={step} verified={verified} still={still} />

        <div className="absolute left-1/2 top-[37%] w-[calc(100%/5+4cqw)] -translate-x-1/2 text-center">
          <p key={`name-${step}`} className="animate-fade-up truncate px-[1cqw] text-[clamp(11px,2.8cqw,16px)] font-medium text-ink">
            {current.name}
          </p>
          <p
            key={`country-${step}`}
            className="animate-fade-up mt-[0.8cqw] flex items-center justify-center gap-[1cqw] text-[clamp(9px,2cqw,12px)] text-muted"
          >
            <current.flag className="h-[0.8em] w-auto rounded-[2px]" />
            {current.country}
          </p>
        </div>
      </div>
    </div>
  );
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(MOTION_QUERY);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  );
}

/** One face in the row, placed by how many slots it is from the middle. */
function Face({
  person,
  offset,
  centred,
  still,
}: {
  person: Person;
  offset: number;
  centred: boolean;
  still: boolean;
}) {
  const leaving = centred && !still;
  const style: CSSProperties = {
    width: `${100 / SLOTS}%`,
    left: `${(100 / SLOTS) * SIDE}%`,
    transform: `translateX(${offset * 100}%)`,
    opacity: Math.abs(offset) > SIDE ? 0 : 1,
    transition: still ? undefined : `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1), opacity ${SLIDE_MS}ms`,
  };

  return (
    <div className="absolute top-[15%] flex flex-col items-center" style={style}>
      {/* Sharp while it is scanned, then blurred, washed green and shrunk away once it passes. */}
      <div
        className={`relative aspect-square w-[74%] overflow-hidden rounded-full bg-brand-tint ${leaving ? "animate-face-out" : ""}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={person.photo} alt="" className="size-full object-cover" />
        <div className={`absolute inset-0 bg-[#2fe0a8] opacity-0 mix-blend-soft-light ${leaving ? "animate-wash-in" : ""}`} />
      </div>

      <span
        className="mt-[2.4cqw] flex max-w-full items-center gap-[0.9cqw] rounded-[1.2cqw] bg-white px-[1.4cqw] py-[0.7cqw] text-[clamp(8px,1.75cqw,11px)] whitespace-nowrap text-body shadow-[0_4px_14px_-8px_rgba(10,16,31,0.25)] ring-1 ring-line/80 transition-opacity duration-200"
        // Hide at once on reaching the card, and only show again once clear of it.
        style={{ opacity: centred ? 0 : 1, transitionDelay: centred || still ? "0ms" : `${SLIDE_MS * 0.7}ms` }}
      >
        <person.flag className="h-[0.85em] w-auto shrink-0 rounded-[1px]" />
        <span className="truncate">{person.country}</span>
      </span>
    </div>
  );
}

/**
 * Ticks round the middle face that fill green clockwise from the top as the scan
 * runs. Once it passes they close into a solid ring that shrinks away with the face.
 */
function ScanRing({ verified, still }: { verified: boolean; still: boolean }) {
  const ticks = "0.45 0.65";
  return (
    <svg
      viewBox="0 0 100 100"
      className={`absolute left-1/2 top-[15%] w-[calc(100%/5*0.74+3.4cqw)] -translate-x-1/2 -translate-y-[1.7cqw] -rotate-90 ${still ? "" : "animate-ring-out"}`}
    >
      <defs>
        <mask id="scan-progress">
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="#fff"
            strokeWidth="8"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset={still ? 0 : undefined}
            className={still ? undefined : "animate-ring-fill"}
          />
        </mask>
      </defs>
      <g className={still ? undefined : "animate-ticks-out"}>
        <circle cx="50" cy="50" r="47" fill="none" stroke="#d7e2de" strokeWidth="4" pathLength={100} strokeDasharray={ticks} />
        {/* The green ticks reach further out than the grey ones, as in a progress dial. */}
        <circle
          cx="50"
          cy="50"
          r="46.5"
          fill="none"
          stroke={verified ? "#0f5246" : "#2fe0a8"}
          strokeWidth="6"
          pathLength={100}
          strokeDasharray={ticks}
          mask="url(#scan-progress)"
          className="transition-[stroke] duration-300"
        />
      </g>
      {!still && (
        <circle cx="50" cy="50" r="43" fill="none" stroke="#2fe0a8" strokeWidth="10" className="animate-solid-in opacity-0" />
      )}
    </svg>
  );
}
