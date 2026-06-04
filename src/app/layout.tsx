import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: `${APP_NAME} — Brutally honest landing page feedback`,
  description: APP_TAGLINE,
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "96x96" },
      { url: "/rmlp-logo.png", type: "image/png", sizes: "1254x1254" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: "/icon.png",
  },
  openGraph: {
    title: APP_NAME,
    description:
      "Paste your URL, pay $4, get a full AI roast with grades and rewrites in 60 seconds.",
    type: "website",
    images: [{ url: "/rmlp-logo.png", width: 1254, height: 1254, alt: APP_NAME }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} min-h-screen overflow-x-hidden font-sans antialiased pb-[env(safe-area-inset-bottom)]`}
      >
        <div className="noise" aria-hidden />
        {children}
      </body>
    </html>
  );
}
