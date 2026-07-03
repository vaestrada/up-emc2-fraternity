import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cinzel, Cormorant } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ThemeProvider } from "@/components/theme-provider";

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
  // TODO: switch to the final domain once the BOT settles domain ownership
  metadataBase: new URL("https://up-emc2-fraternity.vercel.app"),
  icons: {
    icon: "/logo/emc2-mark.png",
    shortcut: "/logo/emc2-mark.png",
  },
  openGraph: {
    title: "EMC² Fraternity | University of the Philippines",
    description:
      "An exclusive Engineering and Physical Sciences brotherhood — 57 years of Equality, Service, and Brotherhood.",
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
    title: "EMC² Fraternity | University of the Philippines",
    description:
      "An exclusive Engineering and Physical Sciences brotherhood — est. 1969.",
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
  alternateName: "UP EMC² Fraternity",
  url: "https://up-emc2-fraternity.vercel.app",
  logo: "https://up-emc2-fraternity.vercel.app/logo/emc2-mark.png",
  foundingDate: "1969",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${cormorant.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
