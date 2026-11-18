import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import "./globals.css";
import { PRODUCT, SITE } from "@/lib/site";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const TITLE = "Zener ID: identity verification and AML screening";
const DESCRIPTION =
  "Identity verification and AML screening. ID documents, liveness, deepfake checks, proof of address and sanctions screening in one flow, with a clear decision and the reasons behind it.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: `%s | ${PRODUCT}` },
  description: DESCRIPTION,
  applicationName: PRODUCT,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: { type: "website", url: SITE, siteName: PRODUCT, title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="overflow-x-clip">{children}</body>
    </html>
  );
}
