/**
 * Speckled grain laid over a background: light and dark flecks, like textured
 * paper. The parent needs `relative` and `overflow-hidden`. `dark` suits the
 * brand gradients; `light` suits pale backgrounds such as the hero reel.
 */
export function Grain({ tone = "dark", opacity }: { tone?: "dark" | "light"; opacity?: number }) {
  return (
    <div
      aria-hidden
      className="bg-noise pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{ opacity: opacity ?? (tone === "dark" ? 0.22 : 0.18) }}
    />
  );
}
