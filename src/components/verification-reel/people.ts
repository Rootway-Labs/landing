import { ET, GH, KE, RW, UG, ZA, type FlagComponent } from "country-flag-icons/react/3x2";

export type Person = {
  /** Shown under the face while it is the one being verified. */
  name: string;
  /** Shown on the flag tag, and as the country line under the name. */
  country: string;
  /** A component from country-flag-icons/react/3x2, imported above by ISO code. */
  flag: FlagComponent;
  /** ISO 3166-1 numeric code, which is how world-atlas names each country shape. */
  mapId: string;
  /** A square photo in public/faces, at least 320px. */
  photo: string;
};

/**
 * The customers the hero reel verifies, in the order they come round. To add or
 * swap someone, drop a square photo in public/faces and add a line here; the reel
 * and the globe pick everything else up from these fields.
 *
 * Photos are from Unsplash (unsplash.com/license): Abenezer Shewaga, Alexandre
 * Lecocq, Terricks Noah, Oluwatobi, Alef Morais and Richard Momodu. The names are
 * made up.
 */
export const PEOPLE: Person[] = [
  { name: "Thabo Nkosi", country: "South Africa", flag: ZA, mapId: "710", photo: "/faces/sipho.webp" },
  { name: "Njeri Ouma", country: "Kenya", flag: KE, mapId: "404", photo: "/faces/wanjiru.webp" },
  { name: "Yves Ganza", country: "Rwanda", flag: RW, mapId: "646", photo: "/faces/eric.webp" },
  { name: "Efua Mensah", country: "Ghana", flag: GH, mapId: "288", photo: "/faces/ama.webp" },
  { name: "Ivan Mukasa", country: "Uganda", flag: UG, mapId: "800", photo: "/faces/brian.webp" },
  { name: "Hana Bekele", country: "Ethiopia", flag: ET, mapId: "231", photo: "/faces/selam.webp" },
];

/** How long each person stays in the middle, in milliseconds. */
export const STEP_MS = 2600;
