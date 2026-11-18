/** Join class names, skipping the empty ones. */
export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");
