import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "framer-motion";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import MotionReady from "@/components/motion/MotionReady";
import "./globals.css";

// Runs before hydration. The server renders Blue Hour by default; an explicitly
// saved dark preference swaps the class before the first paint. `js` lets entrance
// effects hide content until they play; without JS everything is simply visible, and if
// the app has not hydrated after 4s (see MotionReady) the class comes off again.
const themeScript = `(function(){var d=document.documentElement,c=d.classList;c.add("js");setTimeout(function(){if(!d.dataset.hydrated)c.remove("js")},4000);try{var t=localStorage.getItem("theme");if(t==="dark"){c.remove("blue-hour");c.add("dark")}}catch(e){}})();`;

// wdth axis drives the expanded headlines (font-stretch: 125%)
const monaSans = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin"],
  axes: ["wdth"],
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
    "Senior Software Engineer",
    "Full-Stack Engineer",
    "Product Engineer",
    "Frontend Engineer",
    "Node.js",
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
      className={`${monaSans.variable} blue-hour h-full antialiased`}
    >
      <head>
        {/* browser extensions (popup/ad blockers) rewrite inline head scripts before hydration */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* extensions such as ColorZilla add attributes to <body> (cz-shortcut-listen) before hydration */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <div className="scroll-progress" aria-hidden />
        <ThemeProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </ThemeProvider>
        <MotionReady />
        <Analytics />
      </body>
    </html>
  );
}
