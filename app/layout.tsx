import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "avo.re",
  description: "Notes, work, and experiments by Chris Avore",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-neutral-950 text-neutral-100">
      <body
        className={`
            ${geistSans.variable}
            ${geistMono.variable}
            antialiased
            selection:bg-[rgb(var(--accent)/0.25)]
            selection:text-neutral-500  
        `}
      >
        <div className="min-h-screen flex flex-col">
          <header className="px-6 md:px-10 py-6 flex items-center justify-between">
            <a
              href="/"
              className="text-sm tracking-tight font-medium hover:opacity-70 transition"
            >
              avo.re
            </a>

            <nav className="flex gap-6 text-sm text-neutral-400">
              <a href="/writing" className="hover:text-neutral-100 transition">
                Writing
              </a>
              <a href="/work" className="hover:text-neutral-100 transition">
                Work
              </a>
            </nav>
          </header>

          <main className="flex-1 px-6 md:px-10">{children}</main>

          <footer className="px-6 md:px-10 py-8 text-xs text-neutral-500">
            © {new Date().getFullYear()} Chris Avore
          </footer>
        </div>
      </body>
    </html>
  );
}