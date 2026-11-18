"use client";

import { geoCentroid, geoDistance, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo";
import type { Feature, MultiLineString } from "geojson";
import { useEffect, useMemo, useRef, useState } from "react";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

import { STEP_MS, type Person } from "@/components/verification-reel/people";

type Rotation = [lambda: number, phi: number];

type WorldMap = {
  countries: Feature[];
  borders: MultiLineString;
  byId: Record<string, Feature>;
};

/** Globe radius and top margin, as fractions of the canvas width. */
const RADIUS = 0.35;
const TOP = 0.02;
/** How far below the verified country the globe centres, so it sits up in the visible cap. */
const LIFT = 24;
const TURN_MS = STEP_MS * 0.5;
const FADE_MS = 400;

const COLORS = {
  sea: "#ffffff",
  land: "#cfe8de",
  border: "#b5d6c9",
  rim: "#d7ebe3",
  glow: "rgba(15, 82, 70, 0.16)",
  verified: "#0f5246",
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Facing a place with the lift applied, as a d3 rotation. */
const facing = ([lng, lat]: [number, number]): Rotation => [-lng, -(lat - LIFT)];

async function loadMap(): Promise<WorldMap> {
  const topo = (await import("world-atlas/countries-110m.json")).default as unknown as Topology<{
    countries: GeometryCollection;
  }>;
  const countries = feature(topo, topo.objects.countries).features as Feature[];
  return {
    countries,
    borders: mesh(topo, topo.objects.countries, (a, b) => a !== b),
    byId: Object.fromEntries(countries.map((c) => [String(c.id), c])),
  };
}

/**
 * The lower half of the hero reel: a globe that turns to the country of whoever
 * is being verified, fills it in once they pass, and pins their face there.
 */
export function MapGlobe({
  people,
  active,
  verified,
  pinned,
  still,
}: {
  people: Person[];
  /** Index into people of the person in the middle of the reel. */
  active: number;
  /** Whether that person has passed, which fills in their country. */
  verified: boolean;
  /** Indexes of the people whose pins are showing, oldest first. */
  pinned: number[];
  still: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pinRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [map, setMap] = useState<WorldMap | null>(null);

  // What the draw loop reads, kept in refs so it never restarts.
  const state = useRef({ active, verified, pinned, still });
  useEffect(() => {
    state.current = { active, verified, pinned, still };
  });
  const turn = useRef<{ from: Rotation; to: Rotation; start: number } | null>(null);
  const fill = useRef({ alpha: 0, id: "" });

  useEffect(() => {
    loadMap().then(setMap);
  }, []);

  const centroids = useMemo(
    () =>
      people.map((p) => {
        const shape = map?.byId[p.mapId];
        return shape ? (geoCentroid(shape) as [number, number]) : null;
      }),
    [map, people],
  );

  // Start turning towards the new person whenever the reel moves on.
  const target = centroids[active];
  useEffect(() => {
    if (!target) return;
    const now = performance.now();
    const to = facing(target);
    turn.current = { from: turn.current ? currentRotation(turn.current, now) : to, to, start: now };
  }, [target]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();

    const projection = geoOrthographic().clipAngle(90);
    const path = geoPath(projection, ctx);
    const sphere: GeoPermissibleObjects = { type: "Sphere" };

    const size = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };
    size();

    const draw = (now: number) => {
      const { active, verified, pinned, still } = state.current;
      const dt = now - last;
      last = now;

      const r = width * RADIUS;
      const rotation = turn.current ? currentRotation(turn.current, still ? Infinity : now) : ([0, 0] as Rotation);
      projection.scale(r).translate([width / 2, width * TOP + r]).rotate(rotation);

      // The current country fades in once verified, and out before the next one does.
      const want = verified ? (people[active]?.mapId ?? "") : "";
      const step = still ? 1 : dt / FADE_MS;
      if (fill.current.id === want) {
        fill.current.alpha = Math.min(1, fill.current.alpha + step);
      } else {
        fill.current.alpha = Math.max(0, fill.current.alpha - step);
        if (fill.current.alpha === 0) fill.current.id = want;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.beginPath();
      path(sphere);
      ctx.shadowColor = COLORS.glow;
      ctx.shadowBlur = 48;
      ctx.fillStyle = COLORS.sea;
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      for (const country of map.countries) path(country);
      ctx.fillStyle = COLORS.land;
      ctx.fill();

      const lit = map.byId[fill.current.id];
      if (lit && fill.current.alpha > 0) {
        ctx.globalAlpha = fill.current.alpha;
        ctx.beginPath();
        path(lit);
        ctx.fillStyle = COLORS.verified;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.beginPath();
      path(map.borders);
      ctx.strokeStyle = COLORS.border;
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.beginPath();
      path(sphere);
      ctx.strokeStyle = COLORS.rim;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pins are HTML laid over the canvas, moved here so they ride the globe.
      const centre: [number, number] = [-rotation[0], -rotation[1]];
      for (const i of pinned) {
        const pin = pinRefs.current[i];
        const at = centroids[i];
        if (!pin || !at) continue;
        const [x, y] = projection(at) ?? [0, 0];
        const facingUs = geoDistance(at, centre) < Math.PI / 2 - 0.15;
        pin.style.transform = `translate(${x}px, ${y}px)`;
        pin.style.visibility = facingUs ? "visible" : "hidden";
      }

      frame = requestAnimationFrame(draw);
    };

    // Only spend frames while the globe is on screen.
    const seen = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    });
    seen.observe(canvas);

    const resize = new ResizeObserver(size);
    resize.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      resize.disconnect();
    };
  }, [map, people, centroids]);

  return (
    <div className="relative size-full">
      <canvas ref={canvasRef} className="size-full" />
      {pinned.map((i) => (
        <div
          key={`${i}-${people[i].photo}`}
          ref={(el) => {
            pinRefs.current[i] = el;
          }}
          className="invisible absolute left-0 top-0"
        >
          <Pin photo={people[i].photo} current={i === active} />
        </div>
      ))}
    </div>
  );
}

function currentRotation({ from, to, start }: { from: Rotation; to: Rotation; start: number }, now: number): Rotation {
  const t = ease(Math.min(1, Math.max(0, (now - start) / TURN_MS)));
  // Take the short way round.
  const dLambda = ((((to[0] - from[0]) % 360) + 540) % 360) - 180;
  return [from[0] + dLambda * t, from[1] + (to[1] - from[1]) * t];
}

/** A map pin holding the person's face, anchored at its point. */
function Pin({ photo, current }: { photo: string; current: boolean }) {
  return (
    <div className="-translate-x-1/2 -translate-y-full">
      <div className="animate-pin-drop origin-bottom">
        <div
          className={`flex origin-bottom flex-col items-center transition-[scale] duration-500 ${current ? "scale-110" : "scale-90"}`}
        >
          <div className="rounded-full bg-white p-[2px] shadow-[0_6px_16px_-6px_rgba(10,16,31,0.45)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" className="size-[clamp(20px,5.2cqw,30px)] rounded-full object-cover" />
          </div>
          <div className="-mt-px h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-white drop-shadow-[0_2px_1px_rgba(10,16,31,0.15)]" />
        </div>
      </div>
    </div>
  );
}
