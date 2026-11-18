import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "light" | "ghost-light";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-deep text-white hover:bg-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
  outline: "border border-line bg-white text-ink hover:border-ink/25 hover:bg-mist",
  light: "bg-white text-brand-deep hover:bg-paper",
  "ghost-light": "border border-white/20 text-white hover:border-white/40 hover:bg-white/5",
};

export function ButtonLink({
  variant = "primary",
  arrow = true,
  className = "",
  children,
  ...props
}: ComponentProps<"a"> & { variant?: Variant; arrow?: boolean }) {
  return (
    <a
      className={`group inline-flex h-12 items-center justify-center gap-2 rounded-[10px] px-6 text-[15px] font-semibold transition-colors ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
    </a>
  );
}

/**
 * Section heading. `split` (the default) puts the title on the left and the lead
 * on the right, both sitting on the same baseline; `stack` puts the lead under.
 */
export function SectionHeading({
  title,
  lead,
  layout = "split",
  dark = false,
}: {
  title: ReactNode;
  lead?: ReactNode;
  layout?: "split" | "stack";
  dark?: boolean;
}) {
  const heading = (
    <h2
      className={`max-w-2xl text-balance text-[34px] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[48px] ${
        dark ? "text-white" : "text-ink"
      }`}
    >
      {title}
    </h2>
  );
  const body = lead && (
    <p className={`max-w-md text-pretty text-[17px] leading-relaxed ${dark ? "text-white/65" : "text-muted"}`}>{lead}</p>
  );

  if (layout === "stack") {
    return (
      <div className="max-w-2xl">
        {heading}
        {body && <div className="mt-5">{body}</div>}
      </div>
    );
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
      {heading}
      {body && <div className="lg:justify-self-end lg:pb-1.5">{body}</div>}
    </div>
  );
}

/** A small outlined icon, used in lists and grids. */
export function IconMark({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`grid size-10 shrink-0 place-items-center rounded-[10px] border ${
        dark ? "border-white/15 text-brand-sky" : "border-line bg-white text-brand"
      }`}
    >
      {children}
    </span>
  );
}
