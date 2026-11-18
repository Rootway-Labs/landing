import Link from "next/link";
import type { ReactNode } from "react";

import { Rings } from "@/components/brand/rings";
import { Grain } from "@/components/brand/grain";
import { Wordmark } from "@/components/logo";

/**
 * The frame the log-in and sign-up pages share: never taller than the screen,
 * the form on the right and, on wide screens, a grainy brand panel on the left
 * with scan rings. A form taller than the screen scrolls in its column.
 */
export function AuthLayout({ switcher, children }: { switcher: ReactNode; children: ReactNode }) {
  return (
    <div className="grid h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex min-h-0 flex-col overflow-y-auto px-5 py-6 sm:px-10 lg:order-last">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Zener ID home">
            <Wordmark />
          </Link>
          <p className="hidden text-[14px] text-muted sm:block">{switcher}</p>
        </div>

        <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-8">{children}</main>

        <p className="text-[13px] text-muted sm:hidden">{switcher}</p>
      </div>

      <aside className="relative hidden min-h-0 p-3 lg:block">
        <div className="bg-brand-dark relative isolate flex h-full flex-col justify-between overflow-hidden rounded-3xl p-12 xl:p-14">
          <Grain />
          <Rings className="pointer-events-none absolute top-[42%] right-0 size-[min(640px,90%)] translate-x-1/2 -translate-y-1/2" />
          <p className="relative text-[14px] font-medium text-brand-sky">Zener ID</p>
          <h2 className="relative max-w-md text-balance text-[40px] leading-[1.05] font-bold text-white xl:text-[48px]">
            Know who you&apos;re dealing with.
          </h2>
        </div>
      </aside>
    </div>
  );
}
