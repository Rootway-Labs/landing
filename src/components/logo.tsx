/* eslint-disable @next/next/no-img-element */

/** The one-row Zener ID logo (icon first), from brand_assets. `invert` for dark backgrounds. */
export function Wordmark({ invert = false, className = "h-[22px]" }: { invert?: boolean; className?: string }) {
  return (
    <img
      src={invert ? "/brand/zenerid-logo-light.svg" : "/brand/zenerid-logo-dark.svg"}
      alt="Zener ID"
      width={144}
      height={22}
      className={`w-auto ${className}`}
    />
  );
}
