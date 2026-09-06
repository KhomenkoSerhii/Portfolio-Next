import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "framer-motion";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import "./globals.css";

// Runs before hydration. The server renders dark by default; an explicitly
// saved light preference removes the class before the first paint.
const themeScript = `(function(){try{if(localStorage.getItem("theme")==="light"){document.documentElement.classList.remove("dark")}}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s · Serhii Khomenko",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Serhii Khomenko",
    "Frontend Developer",
    "Software Engineer",
    "React",
    "TypeScript",
    "Next.js",
    "AI",
    "LLM",
    "Web3",
    "Lviv",
    "Ukraine",
  ],
  authors: [{ name: "Serhii Khomenko", url: SITE_URL }],
  creator: "Serhii Khomenko",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} dark h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="scroll-progress" aria-hidden />
        <ThemeProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
