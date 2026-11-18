"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { CONTROL } from "@/components/auth/fields";
import { Combobox } from "@/components/ui/combobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cx } from "@/lib/cx";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const parse = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? { y: +match[1], m: +match[2] - 1, d: +match[3] } : null;
};

/**
 * A date field that opens a calendar of its own rather than the browser's. The
 * month and year are chosen from lists (the year one searchable), which suits a
 * date of birth far from today. Posts as YYYY-MM-DD through a hidden input.
 */
export function DatePicker({
  id,
  name,
  value,
  onChange,
  min,
  max,
  invalid,
  placeholder = "Choose a date",
  defaultView,
}: {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  /** YYYY-MM-DD bounds. */
  min: string;
  max: string;
  invalid?: boolean;
  placeholder?: string;
  /** The month to open on when nothing is chosen yet, as YYYY-MM-DD. */
  defaultView?: string;
}) {
  const [open, setOpen] = useState(false);
  const chosen = parse(value);
  const lo = parse(min)!;
  const hi = parse(max)!;
  const start = chosen ?? parse(defaultView ?? max)!;
  const [view, setView] = useState({ y: start.y, m: start.m });

  const years = Array.from({ length: hi.y - lo.y + 1 }, (_, i) => hi.y - i);
  const first = new Date(view.y, view.m, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array<null>(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  const step = (by: number) => {
    const next = new Date(view.y, view.m + by, 1);
    setView({ y: next.getFullYear(), m: next.getMonth() });
  };
  const canBack = view.y > lo.y || (view.y === lo.y && view.m > lo.m);
  const canOn = view.y < hi.y || (view.y === hi.y && view.m < hi.m);
  const outOfRange = (d: number) => {
    const day = iso(view.y, view.m, d);
    return day < min || day > max;
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next && chosen) setView({ y: chosen.y, m: chosen.m });
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          aria-describedby={invalid && id ? `${id}-error` : undefined}
          className={cx(CONTROL, "flex items-center gap-2 text-left", invalid && "border-red-600 focus:border-red-600 focus:ring-red-600/10")}
        >
          <span className={cx("flex-1 truncate", !chosen && "text-muted/70")}>
            {chosen ? `${chosen.d} ${MONTHS[chosen.m]} ${chosen.y}` : placeholder}
          </span>
          <CalendarDays className="size-4 shrink-0 text-muted" aria-hidden />
        </button>
      </PopoverTrigger>
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <PopoverContent className="w-[320px] p-3">
        <div className="grid grid-cols-[36px_minmax(0,1fr)_92px_36px] items-center gap-1.5">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={!canBack}
            aria-label="Previous month"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-body hover:bg-cloud disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <Combobox
            options={MONTHS.map((label, m) => ({ value: String(m), label }))}
            value={String(view.m)}
            onChange={(m) => setView({ y: view.y, m: +m })}
            searchable={false}
            compact
          />
          <Combobox
            options={years.map((y) => ({ value: String(y), label: String(y) }))}
            value={String(view.y)}
            onChange={(y) => setView({ y: +y, m: view.m })}
            searchPlaceholder="Year"
            emptyText="No such year."
            compact
          />
          <button
            type="button"
            onClick={() => step(1)}
            disabled={!canOn}
            aria-label="Next month"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-body hover:bg-cloud disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((day) => (
            <span key={day} className="py-1 text-[12px] font-medium text-muted">
              {day}
            </span>
          ))}
          {cells.map((d, i) =>
            d === null ? (
              <span key={`blank-${i}`} />
            ) : (
              <button
                key={d}
                type="button"
                disabled={outOfRange(d)}
                onClick={() => {
                  onChange(iso(view.y, view.m, d));
                  setOpen(false);
                }}
                className={cx(
                  "h-9 rounded-lg text-[14px] transition-colors disabled:text-muted/40",
                  chosen && chosen.y === view.y && chosen.m === view.m && chosen.d === d
                    ? "bg-brand font-medium text-white"
                    : "text-ink hover:bg-brand-tint hover:text-brand-deep disabled:hover:bg-transparent",
                )}
              >
                {d}
              </button>
            ),
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
