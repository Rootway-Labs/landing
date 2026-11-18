"use client";

import { Command } from "cmdk";
import { Check, ChevronDown, Search } from "lucide-react";
import { useState, type ReactNode } from "react";

import { CONTROL } from "@/components/auth/fields";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cx } from "@/lib/cx";

/** The smaller field, for pickers inside another control (the calendar's month and year). */
const COMPACT =
  "h-9 w-full rounded-lg border border-line bg-white px-2.5 text-[14px] text-ink outline-none transition-[border-color,box-shadow] focus:border-brand focus:ring-4 focus:ring-brand/10";

export type ComboboxOption = {
  value: string;
  label: string;
  /** Shown faintly after the label, and searched too: a dialling code, say. */
  hint?: string;
  icon?: ReactNode;
};

/**
 * A select that opens a searchable list (shadcn's Combobox: a Popover holding a
 * cmdk Command), styled like the other fields. With `name` it also carries its
 * value in a hidden input, so it posts with the form like a native select.
 */
export function Combobox({
  id,
  name,
  options,
  value,
  onChange,
  placeholder = "Choose",
  searchPlaceholder = "Search",
  emptyText = "Nothing matches.",
  searchable = true,
  compact = false,
  invalid,
  display,
  className,
  listClassName,
}: {
  id?: string;
  name?: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  searchable?: boolean;
  compact?: boolean;
  invalid?: boolean;
  /** How the chosen option reads in the closed field. Defaults to its icon and label. */
  display?: (option: ComboboxOption) => ReactNode;
  className?: string;
  listClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const chosen = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          aria-describedby={invalid && id ? `${id}-error` : undefined}
          className={cx(compact ? COMPACT : CONTROL, "flex items-center gap-2 text-left", invalid && "border-red-600 focus:border-red-600 focus:ring-red-600/10", className)}
        >
          {chosen ? (
            <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
              {display ? display(chosen) : (
                <>
                  {chosen.icon}
                  <span className="truncate">{chosen.label}</span>
                </>
              )}
            </span>
          ) : (
            <span className="flex-1 truncate text-muted/70">{placeholder}</span>
          )}
          <ChevronDown className={cx("size-4 shrink-0 text-muted transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      </PopoverTrigger>
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <PopoverContent className={cx("w-(--radix-popover-trigger-width) p-0", compact ? "min-w-32" : "min-w-60")}>
        <Command loop>
          {searchable ? (
            <div className="flex items-center gap-2 border-b border-line px-3">
              <Search className="size-4 shrink-0 text-muted" aria-hidden />
              <Command.Input
                placeholder={searchPlaceholder}
                className="h-11 w-full bg-transparent text-[14.5px] text-ink outline-none placeholder:text-muted/70"
              />
            </div>
          ) : null}
          <Command.List className={cx("max-h-64 scroll-py-1 overflow-y-auto p-1", listClassName)}>
            <Command.Empty className="px-3 py-6 text-center text-[14px] text-muted">{emptyText}</Command.Empty>
            {options.map((option) => (
              <Command.Item
                key={option.value}
                value={`${option.label} ${option.hint ?? ""} ${option.value}`}
                onSelect={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[14.5px] text-ink outline-none select-none data-[selected=true]:bg-brand-tint data-[selected=true]:text-brand-deep"
              >
                {option.icon}
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {option.hint ? <span className="text-[13px] text-muted">{option.hint}</span> : null}
                <Check className={cx("size-4 shrink-0 text-brand", option.value === value ? "opacity-100" : "opacity-0")} aria-hidden />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
