import { ButtonLink } from "@/components/ui";
import { VerificationReel } from "@/components/verification-reel";
import { SIGN_UP_HREF } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="border-b border-line">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pt-14 pb-20 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pt-20 lg:pb-24">
        <div className="animate-fade-up">
          <h1 className="text-balance text-[46px] leading-[0.98] font-extrabold tracking-[-0.04em] text-ink sm:text-[64px] xl:text-[72px]">
            Know who you&apos;re dealing with
          </h1>
          <p className="mt-7 max-w-lg text-pretty text-[18px] leading-relaxed text-body">
            Verify ID documents, faces and addresses, catch deepfakes and screen every customer against AML lists. One
            short flow for your customer, and a clear decision for you.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={SIGN_UP_HREF}>Get started</ButtonLink>
            <ButtonLink href="#how-it-works" variant="outline" arrow={false}>
              See how it works
            </ButtonLink>
          </div>
        </div>

        <div className="animate-fade-up relative w-full" style={{ animationDelay: "120ms" }}>
          <VerificationReel />
        </div>
      </div>
    </section>
  );
}
