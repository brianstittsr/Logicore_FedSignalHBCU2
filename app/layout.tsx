import type { Metadata } from "next";
import { Manrope, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AccessibilityWidget } from "@/components/shared/accessibility-widget";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://logicorehsv.com"),
  title: {
    default: "LogiCore HSV | Cyber Security, Logistics & Software Engineering",
    template: "%s | LogiCore HSV",
  },
  description:
    "LogiCore Corporation provides cybersecurity, logistics engineering, and software engineering services supporting the Department of Defense and federal agencies.",
  keywords: [
    "cybersecurity",
    "logistics engineering",
    "software engineering",
    "performance-based logistics",
    "value engineering",
    "defense contractor",
    "Huntsville AL",
    "DoD support services",
    "HBCU partnerships",
    "government contracting",
    "federal funding intelligence",
    "Army logistics",
    "AMCOM",
  ],
  authors: [{ name: "LogiCore Corporation", url: "https://logicorehsv.com" }],
  creator: "LogiCore Corporation",
  publisher: "LogiCore Corporation",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://logicorehsv.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://logicorehsv.com",
    siteName: "LogiCore HSV",
    title: "LogiCore HSV | Cyber Security, Logistics & Software Engineering",
    description:
      "LogiCore Corporation provides cybersecurity, logistics engineering, and software engineering services supporting the Department of Defense and federal agencies.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LogiCore HSV - Cyber Security, Logistics & Software Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LogiCore HSV | Cyber Security, Logistics & Software Engineering",
    description:
      "LogiCore Corporation provides cybersecurity, logistics engineering, and software engineering services supporting the Department of Defense and federal agencies.",
    images: ["/og-image.png"],
    creator: "@logicorehsv",
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "government",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Skip to main content link for keyboard users - WCAG 2.4.1 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${manrope.variable} ${dmSans.variable} font-sans antialiased`}>
        {/* Skip to main content link - WCAG 2.4.1 Bypass Blocks */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        {children}
        <Toaster />
        {/* UserWay Accessibility Widget */}
        <AccessibilityWidget />
      </body>
    </html>
  );
}
