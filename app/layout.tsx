import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cinzel, Cormorant } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SITE_URL } from "@/lib/site";

// regenerate every route daily so computed years (footer copyright, the
// home "Years of Brotherhood" counter) never go stale on Jan 1 — segment
// config on the root layout cascades to every page beneath it.
export const revalidate = 86400;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Cinzel carries the Trajan-style Roman capitals of the fraternity's logo lockup;
// Cormorant supplies the classical italics Cinzel deliberately lacks.
const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
});

const cormorant = Cormorant({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | EMC² Fraternity",
    default: "EMC² Fraternity | University of the Philippines",
  },
  description:
    "The EMC² Fraternity of the U.P. College of Engineering — founded 1969. Equality, Service, Brotherhood.",
  metadataBase: new URL(SITE_URL),
  // "./" resolves per-route, so every page declares itself canonical
  alternates: { canonical: "./" },
  // No title/description here on purpose: Next merges og/twitter shallowly and
  // its title template does NOT reach them, so hardcoding here would stamp the
  // homepage card on every route. Omitting them lets each page's resolved title
  // and description flow into its own card (see per-page metadata exports).
  openGraph: {
    siteName: "EMC² Fraternity",
    type: "website",
    locale: "en_PH",
    images: [
      {
        url: "/photos/anniv55-group-outdoor.jpg",
        width: 2048,
        height: 1365,
        alt: "EMC² Fraternity brods at the 55th Anniversary Celebration, U.P. Diliman",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/photos/anniv55-group-outdoor.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#071e0c",
};

// Organization schema so search engines render a proper knowledge card.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EMC² Fraternity",
  // include ASCII spellings — "EMC2" is what alumni actually type, and ² is not
  // guaranteed to normalize to 2 in entity matching
  alternateName: ["UP EMC² Fraternity", "EMC2 Fraternity", "UP EMC2 Fraternity"],
  description:
    "An exclusive Engineering and Physical Sciences brotherhood founded in 1969 at the University of the Philippines College of Engineering.",
  "@id": `${SITE_URL}/#organization`,
  url: SITE_URL,
  logo: `${SITE_URL}/logo/emc2-mark.png`,
  foundingDate: "1969",
  foundingLocation: {
    "@type": "Place",
    name: "U.P. College of Engineering, Diliman, Quezon City, Philippines",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "3rd Floor Lobby, Melchor Hall, University of the Philippines",
    addressLocality: "Quezon City",
    addressRegion: "Metro Manila",
    addressCountry: "PH",
  },
  sameAs: [
    "https://www.facebook.com/EMC2Fraternity",
    "https://www.linkedin.com/company/up-emc2-fraternity",
  ],
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "University of the Philippines",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${cormorant.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* without JS the reveal animations never fire — force their content visible */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;filter:none !important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-[var(--frat-gold)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-[0.2em] focus:text-[#1a1305] focus:uppercase"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
