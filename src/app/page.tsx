import { Benefits } from "@/components/benefits";
import { Checks } from "@/components/checks";
import { Faq, QUESTIONS } from "@/components/faq";
import { ClosingCta, Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Industries } from "@/components/industries";
import { Platform } from "@/components/platform";
import { Security } from "@/components/security";
import { CONTACT_EMAIL, PRODUCT, SITE } from "@/lib/site";

/** Structured data so search engines can show the product and the FAQ as rich results. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE}/#organization`, name: PRODUCT, url: SITE, email: CONTACT_EMAIL },
    {
      "@type": "SoftwareApplication",
      name: PRODUCT,
      url: SITE,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Identity verification and AML screening: ID documents, liveness, deepfake checks, proof of address and sanctions screening in one flow.",
      provider: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "FAQPage",
      mainEntity: QUESTIONS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Checks />
        <HowItWorks />
        <Platform />
        <Industries />
        <Security />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
