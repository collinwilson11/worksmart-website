import type { Metadata } from "next";
import { IM_Fell_English, IBM_Plex_Mono, Work_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

/* IM Fell English: a digitization of genuine 17th-century printing type,
   ink-bleed irregularities and all. The whole site reads like it was set on
   an expedition-era press. One weight (400) + a gorgeous true italic. */
const fell = IM_Fell_English({
  variable: "--font-fell",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WorkSmart SC — AI Consulting for Greenville Businesses",
  description:
    "WorkSmart SC helps small and medium businesses in Greenville, SC automate operations and grow smarter with AI. Five careful phases, from diagnosis to refinement.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fell.variable} ${plexMono.variable} ${workSans.variable} antialiased`}
    >
      <body>
        <SmoothScroll />
        <div style={{ overflowX: "clip" }}>
          {children}
        </div>
        <div className="grain-overlay" aria-hidden />
      </body>
    </html>
  );
}
