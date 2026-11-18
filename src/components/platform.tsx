"use client";

import {
  FileBarChart,
  FileText,
  History,
  House,
  KeyRound,
  ListChecks,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Users,
  Webhook,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Grain } from "@/components/brand/grain";
import { SectionHeading } from "@/components/ui";

type Item = { icon: LucideIcon; label: string };

const GROUPS: { title: string; lead: string; items: Item[] }[] = [
  {
    title: "Checks",
    lead: "What each customer goes through.",
    items: [
      { icon: FileText, label: "ID document" },
      { icon: ScanFace, label: "Liveness and face match" },
      { icon: House, label: "Proof of address" },
      { icon: ShieldCheck, label: "AML screening" },
      { icon: Sparkles, label: "Deepfake detection" },
      { icon: History, label: "Ongoing AML monitoring" },
    ],
  },
  {
    title: "Console",
    lead: "Where your team works.",
    items: [
      { icon: ListChecks, label: "Verifications and review" },
      { icon: FileBarChart, label: "PDF verification reports" },
      { icon: History, label: "Audit log" },
      { icon: Users, label: "Accounts and roles" },
    ],
  },
  {
    title: "Integration",
    lead: "How it connects to your product.",
    items: [
      { icon: KeyRound, label: "REST API with API keys" },
      { icon: Webhook, label: "Result callbacks" },
    ],
  },
];

/** How long each group stays before the next one, while nobody is choosing. */
const STEP_MS = 6000;

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

/**
 * What Zener ID is made of, in three groups side by side: Checks, Console
 * and Integration. Each has a progress bar that fills while its items show, then
 * hands over to the next, so the section reads as one panel instead of a long
 * column. Choosing a group shows it at once; pointing at the panel holds it, and
 * it only runs while on screen. With reduced motion it does not move on its own.
 */
export function Platform() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [seen, setSeen] = useState(false);
  const still = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const watch = new IntersectionObserver(([entry]) => setSeen(entry.isIntersecting), { threshold: 0.35 });
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  // On a phone the tabs scroll sideways: bring the one showing into view, without moving the page.
  useEffect(() => {
    const tab = document.getElementById(`platform-tab-${active}`);
    const list = tab?.parentElement;
    if (tab && list && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: tab.offsetLeft - list.offsetLeft - 20, behavior: still ? "auto" : "smooth" });
    }
  }, [active, still]);

  const running = !still && seen && !held;
  const group = GROUPS[active];

  return (
    <section className="bg-brand-dark relative isolate overflow-hidden py-20 text-white lg:py-28">
      <Grain />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[400px_1fr] lg:gap-16">
        <div>
          <SectionHeading
            layout="stack"
            dark
            title="See how it all connects"
            lead="Start with the checks you need today and add more as your requirements grow. Nothing to stitch together."
          />
        </div>

        <div ref={ref} className="min-w-0" onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}>
          <div
            role="tablist"
            aria-label="What Zener ID is made of"
            className="-mx-5 flex snap-x scroll-px-5 gap-6 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:scroll-px-0 sm:grid-cols-3 sm:overflow-visible sm:px-0"
          >
            {GROUPS.map((g, i) => {
              const on = i === active;
              return (
                <button
                  key={g.title}
                  type="button"
                  role="tab"
                  id={`platform-tab-${i}`}
                  aria-selected={on}
                  aria-controls="platform-panel"
                  onClick={() => setActive(i)}
                  className="group min-w-[210px] shrink-0 snap-start text-left sm:min-w-0"
                >
                  <span className={`block text-[24px] font-semibold transition-colors ${on ? "text-white" : "text-white/45 group-hover:text-white/70"}`}>
                    {g.title}
                  </span>
                  <span className={`mt-1 block text-[14px] transition-colors ${on ? "text-white/60" : "text-white/35"}`}>{g.lead}</span>
                  <span className="mt-4 block h-[3px] overflow-hidden rounded-full bg-white/10" aria-hidden>
                    {on ? (
                      <span
                        key={`${active}-${still}`}
                        className="block h-full origin-left rounded-full bg-brand-sky"
                        style={
                          still
                            ? undefined
                            : {
                                animation: `tab-progress ${STEP_MS}ms linear both`,
                                animationPlayState: running ? "running" : "paused",
                              }
                        }
                        onAnimationEnd={() => setActive((active + 1) % GROUPS.length)}
                      />
                    ) : i < active ? (
                      <span className="block h-full rounded-full bg-white/30" />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <ul
            key={group.title}
            id="platform-panel"
            role="tabpanel"
            aria-labelledby={`platform-tab-${active}`}
            className="animate-fade-up mt-8 grid min-h-[204px] content-start gap-3 sm:grid-cols-2"
          >
            {group.items.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-[15.5px] text-white/90 transition-colors hover:border-white/20 hover:bg-white/[0.07]"
              >
                <Icon className="size-5 text-brand-sky" strokeWidth={1.6} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
