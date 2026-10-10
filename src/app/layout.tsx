import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevJudge - Technical Assessment & Automated Code Judge Platform",
  description:
    "Evaluate candidate coding skills in real-time with automated test case execution, live proctoring, and comprehensive analytics.",
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('devjudge_theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || 'dark';
    var resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required for blocking theme initialization script to prevent theme flash */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-300 transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
