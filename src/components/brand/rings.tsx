import { useId } from "react";

/**
 * Concentric scan rings with a soft Mint glow at the centre and two arcs turning
 * slowly, echoing the scan ring round each face in the hero reel. A background
 * graphic for the dark brand panels; place it so half sits off the panel's edge.
 */
export function Rings({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#2FE0A8" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#2FE0A8" stopOpacity="0.12" />
          <stop offset="1" stopColor="#2FE0A8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="300" fill={`url(#${id}-glow)`} />
      {[70, 125, 180, 235, 290].map((r) => (
        <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="#F3F7F2" strokeOpacity="0.14" strokeWidth="1" />
      ))}
      {/* Tick ring, like a scan dial */}
      <circle
        cx="300"
        cy="300"
        r="152"
        fill="none"
        stroke="#F3F7F2"
        strokeOpacity="0.28"
        strokeWidth="6"
        pathLength={100}
        strokeDasharray="0.3 0.95"
      />
      <g className="animate-[spin_24s_linear_infinite] origin-center [transform-box:fill-box]">
        <circle
          cx="300"
          cy="300"
          r="180"
          fill="none"
          stroke="#2FE0A8"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="22 78"
        />
      </g>
      <g className="animate-[spin_36s_linear_infinite_reverse] origin-center [transform-box:fill-box]">
        <circle
          cx="300"
          cy="300"
          r="235"
          fill="none"
          stroke="#D9F26B"
          strokeOpacity="0.8"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="10 90"
        />
      </g>
      <circle cx="300" cy="300" r="6" fill="#2FE0A8" />
    </svg>
  );
}
