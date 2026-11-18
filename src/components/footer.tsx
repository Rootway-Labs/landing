import { Rings } from "@/components/brand/rings";
import { Grain } from "@/components/brand/grain";
import { Wordmark } from "@/components/logo";
import { ButtonLink } from "@/components/ui";
import { CONTACT_EMAIL, CONTACT_HREF, PRIVACY_URL, PRODUCT, SIGN_IN_HREF, SIGN_UP_HREF, TERMS_URL } from "@/lib/site";

/** The closing call to action: a grainy brand gradient with scan rings half off the right edge. */
export function ClosingCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 pt-4 sm:px-8 lg:pb-28">
      <div className="bg-brand-dark relative isolate overflow-hidden rounded-3xl px-6 py-14 sm:px-14 sm:py-20">
        <Grain />
        <Rings className="pointer-events-none absolute top-1/2 right-0 hidden size-[520px] translate-x-1/2 -translate-y-1/2 md:block lg:size-[620px]" />
        <div className="relative max-w-xl">
          <h2 className="text-balance text-[34px] leading-[1.1] font-bold text-white sm:text-[52px]">
            Know who you&apos;re dealing with
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-white/70">
            Create an account and set up the checks your onboarding needs.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={SIGN_UP_HREF} variant="light">
              Get started
            </ButtonLink>
            <ButtonLink href={CONTACT_HREF} variant="ghost-light" arrow={false}>
              Contact sales
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Footer columns, laid out like Sumsub's. Trim what does not apply. */
const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "ID document verification", href: "/#product" },
      { label: "Liveness and face match", href: "/#product" },
      { label: "Deepfake detection", href: "/#product" },
      { label: "Proof of address", href: "/#product" },
      { label: "AML screening", href: "/#product" },
      { label: "Ongoing monitoring", href: "/#product" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Banks", href: "/#industries" },
      { label: "Fintech and payments", href: "/#industries" },
      { label: "Brokerage and trading", href: "/#industries" },
      { label: "Digital assets", href: "/#industries" },
      { label: "Lending", href: "/#industries" },
      { label: "Insurance", href: "/#industries" },
      { label: "Marketplaces", href: "/#industries" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API reference", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Integration guide", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "System status", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Guides", href: "#" },
      { label: "KYC glossary", href: "#" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Security", href: "/#security" },
      { label: "Contact us", href: CONTACT_HREF },
    ],
  },
];

const LEGAL = [
  { label: "Privacy notice", href: PRIVACY_URL },
  { label: "Terms of service", href: TERMS_URL },
  { label: "Cookie policy", href: "#" },
  { label: "Data processing", href: "#" },
  { label: "Sitemap", href: "#" },
];

const SOCIAL: { label: string; href: string; path: string }[] = [
  {
    label: "LinkedIn",
    href: "#",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z",
  },
  {
    label: "X",
    href: "#",
    path: "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.12C19.54 3.58 12 3.58 12 3.58s-7.54 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.86.5 9.4.5 9.4.5s7.54 0 9.4-.5a3 3 0 0 0 2.1-2.12A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.57V8.43L15.82 12 9.6 15.57Z",
  },
];

/** A large, link-dense footer modelled on Sumsub's: brand and contact, five link columns, then legal and social. */
export function Footer() {
  return (
    <footer className="bg-brand-deep text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 border-b border-white/10 py-16 lg:grid-cols-[1.2fr_3fr] lg:gap-16">
          <div>
            <Wordmark invert />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/60">
              Identity verification and AML screening. Know who you&apos;re dealing with.
            </p>
            <a
              href={CONTACT_HREF}
              className="mt-5 inline-block text-[15px] text-white/80 underline-offset-4 transition-colors hover:text-brand-sky hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={SIGN_UP_HREF}
                className="inline-flex h-11 items-center rounded-lg bg-white px-5 text-[15px] font-medium text-brand-deep transition-colors hover:bg-brand-tint"
              >
                Get started
              </a>
              <a
                href={SIGN_IN_HREF}
                className="inline-flex h-11 items-center rounded-lg border border-white/20 px-5 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
              >
                Log in
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:flex lg:justify-between lg:gap-10">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-[13px] font-semibold tracking-wider text-white/45 uppercase">{column.title}</h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-[14.5px] text-white/80 transition-colors hover:text-brand-sky">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 border-b border-white/10 py-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-[14px] text-white/60 transition-colors hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex gap-2">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-lg border border-white/10 text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 py-7 text-[13.5px] text-white/45 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {PRODUCT}. All rights reserved.
          </p>
          <p>Identity verification and AML screening.</p>
        </div>
      </div>
    </footer>
  );
}
