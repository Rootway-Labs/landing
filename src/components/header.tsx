"use client";

import {
  BookOpen,
  Building2,
  ChevronDown,
  CircleHelp,
  Code2,
  FileText,
  Fingerprint,
  HandCoins,
  House,
  LayoutDashboard,
  Mail,
  Menu,
  Radar,
  ScanFace,
  ShieldCheck,
  Store,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/logo";
import { CONTACT_HREF, DASHBOARD_URL, SIGN_IN_HREF, SIGN_UP_HREF } from "@/lib/site";

type MenuItem = { icon: LucideIcon; label: string; text: string; href: string };
type NavEntry = { label: string; href?: string; items?: MenuItem[] };

/** The top navigation. Entries with items open a dropdown panel, like Sumsub's. */
const NAV: NavEntry[] = [
  {
    label: "Products",
    items: [
      { icon: FileText, label: "ID document verification", text: "Read and check identity documents", href: "/#product" },
      { icon: ScanFace, label: "Liveness and face match", text: "A real person, matching their ID", href: "/#product" },
      { icon: Fingerprint, label: "Deepfake detection", text: "Catch generated and swapped faces", href: "/#product" },
      { icon: House, label: "Proof of address", text: "Verify where a customer lives", href: "/#product" },
      { icon: ShieldCheck, label: "AML screening", text: "Sanctions, PEP and watchlists", href: "/#product" },
      { icon: Radar, label: "Ongoing monitoring", text: "Re-screen customers over time", href: "/#product" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { icon: Building2, label: "Banks", text: "Open accounts remotely", href: "/#industries" },
      { icon: Wallet, label: "Fintech and payments", text: "Onboard users in your app", href: "/#industries" },
      { icon: HandCoins, label: "Lending", text: "Know who you lend to", href: "/#industries" },
      { icon: Store, label: "Online platforms", text: "Keep fake accounts out", href: "/#industries" },
    ],
  },
  {
    label: "Developers",
    items: [
      { icon: Code2, label: "API reference", text: "Endpoints and payloads", href: "#" },
      { icon: BookOpen, label: "Documentation", text: "Guides to get you live", href: "#" },
    ],
  },
  {
    label: "Company",
    items: [
      { icon: Users, label: "About us", text: "Who we are", href: "#" },
      { icon: ShieldCheck, label: "Security", text: "How we protect data", href: "/#security" },
      { icon: CircleHelp, label: "FAQ", text: "Common questions", href: "/#faq" },
      { icon: Mail, label: "Contact", text: "Talk to our team", href: CONTACT_HREF },
    ],
  },
  { label: "How it works", href: "/#how-it-works" },
];

/**
 * Whether this browser is signed in to the dashboard, asked of this site's
 * /api/auth/session once the page has loaded. Signed out until it answers.
 */
function useSignedIn() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    let live = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json() as Promise<{ signedIn?: boolean }>)
      .then((answer) => live && setSignedIn(answer.signedIn === true))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return signedIn;
}

export function Header() {
  const signedIn = useSignedIn();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMenu = (label: string) => {
    clearTimeout(closeTimer.current);
    setMenu(label);
  };
  const closeMenu = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 120);
  };

  const active = NAV.find((n) => n.label === menu && n.items);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white transition-colors ${
        scrolled || open || active ? "border-line" : "border-transparent"
      }`}
      onMouseLeave={closeMenu}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" aria-label="Zener ID, home" className="shrink-0">
            <Wordmark />
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Main">
            {NAV.map((entry) =>
              entry.items ? (
                <button
                  key={entry.label}
                  type="button"
                  aria-expanded={menu === entry.label}
                  onMouseEnter={() => openMenu(entry.label)}
                  onFocus={() => openMenu(entry.label)}
                  onClick={() => setMenu(menu === entry.label ? null : entry.label)}
                  className={`flex h-[72px] items-center gap-1 px-3.5 text-[15px] transition-colors ${
                    menu === entry.label ? "text-brand" : "text-ink hover:text-brand"
                  }`}
                >
                  {entry.label}
                  <ChevronDown
                    className={`size-4 transition-transform ${menu === entry.label ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
              ) : (
                <a
                  key={entry.label}
                  href={entry.href}
                  onMouseEnter={closeMenu}
                  className="flex h-[72px] items-center px-3.5 text-[15px] text-ink transition-colors hover:text-brand"
                >
                  {entry.label}
                </a>
              ),
            )}
          </nav>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          {signedIn ? (
            <a
              href={DASHBOARD_URL}
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-brand-deep px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand"
            >
              <LayoutDashboard className="size-4" aria-hidden />
              Go to dashboard
            </a>
          ) : (
            <>
              <a href={CONTACT_HREF} className="text-[15px] text-ink transition-colors hover:text-brand">
                Contact sales
              </a>
              <a href={SIGN_IN_HREF} className="text-[15px] text-ink transition-colors hover:text-brand">
                Log in
              </a>
              <a
                href={SIGN_UP_HREF}
                className="inline-flex h-11 items-center rounded-[10px] bg-brand-deep px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand"
              >
                Get started
              </a>
            </>
          )}
        </div>

        <button
          type="button"
          className="-mr-2 grid size-10 place-items-center rounded-lg text-ink hover:bg-cloud lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Desktop dropdown: a full-width panel under the bar, its content on the same edges as the page. */}
      {active?.items && (
        <div
          className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_40px_-24px_rgba(11,22,20,0.18)] lg:block"
          onMouseEnter={() => openMenu(active.label)}
        >
          <div className="mx-auto grid max-w-7xl grid-cols-3 gap-2 px-5 py-6 sm:px-8">
            {active.items.map(({ icon: Icon, label, text, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenu(null)}
                className="group flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-mist"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand">
                  <Icon className="size-5" strokeWidth={1.7} aria-hidden />
                </span>
                <span>
                  <span className="block text-[15px] font-medium text-ink group-hover:text-brand">{label}</span>
                  <span className="mt-0.5 block text-[13.5px] text-muted">{text}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {open && (
        <div className="max-h-[calc(100svh-72px)] overflow-y-auto border-t border-line bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-5 pb-6 sm:px-8">
            <nav className="flex flex-col" aria-label="Main">
              {NAV.map((entry) =>
                entry.items ? (
                  <details key={entry.label} className="group border-b border-line [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex list-none items-center justify-between py-4 text-[16px] text-ink">
                      {entry.label}
                      <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" aria-hidden />
                    </summary>
                    <ul className="pb-3">
                      {entry.items.map(({ icon: Icon, label, href }) => (
                        <li key={label}>
                          <a
                            href={href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 py-2.5 text-[15px] text-body"
                          >
                            <Icon className="size-4 text-brand" aria-hidden />
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <a
                    key={entry.label}
                    href={entry.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-line py-4 text-[16px] text-ink"
                  >
                    {entry.label}
                  </a>
                ),
              )}
            </nav>
            {signedIn ? (
              <a
                href={DASHBOARD_URL}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand-deep text-[15px] font-semibold text-white"
              >
                <LayoutDashboard className="size-4" aria-hidden />
                Go to dashboard
              </a>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a
                  href={SIGN_IN_HREF}
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-line text-[15px] font-medium text-ink"
                >
                  Log in
                </a>
                <a
                  href={SIGN_UP_HREF}
                  className="inline-flex h-12 items-center justify-center rounded-[10px] bg-brand-deep text-[15px] font-semibold text-white"
                >
                  Get started
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
