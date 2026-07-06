import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { StorefrontChrome } from "@/components/layout/StorefrontChrome";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.loomoraco.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Loomora & Co. | Handmade Luxury Carpets & Rugs",
    template: "%s | Loomora & Co.",
  },
  description:
    "Loomora & Co. crafts hand-knotted and hand-tufted rugs and carpets for discerning homes across the US, UK, Europe and the Middle East. Shop Persian-style, modern and custom rugs.",
  keywords: [
    "handmade rugs",
    "hand tufted carpets",
    "persian rugs",
    "luxury carpets",
    "custom rugs",
    "wool rugs",
  ],
  openGraph: {
    type: "website",
    siteName: "Loomora & Co.",
    title: "Loomora & Co. | Handmade Luxury Carpets & Rugs",
    description:
      "Hand-knotted and hand-tufted rugs, woven by master artisans. Explore Persian-style, modern and fully custom rugs.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Loomora & Co. | Handmade Luxury Carpets & Rugs",
    description: "Hand-knotted and hand-tufted rugs, woven by master artisans.",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Loomora & Co.",
              url: SITE_URL,
              logo: `${SITE_URL}/images/logo.png`,
              sameAs: [
                "https://instagram.com/loomoraco",
                "https://facebook.com/loomoraco",
              ],
            }),
          }}
        />
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <StorefrontChrome>{children}</StorefrontChrome>
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
