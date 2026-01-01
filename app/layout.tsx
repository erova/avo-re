import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AmbientBackground } from "@/components/AmbientBackground";

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
        <AmbientBackground />
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 border-b border-neutral-800/60 bg-neutral-950/60 backdrop-blur">
            <div className="mx-auto max-w-6xl px-6 py-4 grid grid-cols-[auto_1fr] items-center">
              <a
                href="/"
                className="text-sm tracking-tight font-medium hover:opacity-70 transition"
              >
                avo.re
              </a>

              <nav className="flex justify-end gap-6 text-sm text-neutral-400">
                <a
                  data-nav
                  href="/work"
                  className="hover:text-neutral-100 transition hover:underline underline-offset-4"
                >
                  Work
                </a>
                <a
                  data-nav
                  href="/writing"
                  className="hover:text-neutral-100 transition hover:underline underline-offset-4"
                >
                  Writing
                </a>
                <a
                  data-nav
                  href="/now"
                  className="hover:text-neutral-100 transition hover:underline underline-offset-4"
                >
                  Now
                </a>
                <a
                  data-nav
                  href="/about"
                  className="hover:text-neutral-100 transition hover:underline underline-offset-4"
                >
                  About
                </a>
              </nav>
            </div>
          </header>

          <Script id="active-nav" strategy="afterInteractive">
            {`
              (function () {
                try {
                  var path = window.location.pathname || '/';
                  var links = document.querySelectorAll('header a[data-nav]');
                  links.forEach(function (a) {
                    var href = a.getAttribute('href') || '';
                    if (!href.startsWith('/')) return;
                    var isActive = path === href || (href !== '/' && path.startsWith(href + '/'));
                    if (isActive) {
                      a.classList.add('text-neutral-100', 'underline');
                      a.classList.remove('text-neutral-400');
                      a.setAttribute('aria-current', 'page');
                    }
                  });
                } catch (e) {}
              })();
            `}
          </Script>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-neutral-800/60">
            <div className="mx-auto max-w-6xl px-6 py-10 text-xs text-neutral-500 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} Chris Avore</div>
              <div className="flex gap-4">
                <a
                  href="mailto:chris@avo.re"
                  className="hover:text-neutral-200 transition"
                >
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/chrisavore/"
                  className="hover:text-neutral-200 transition"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href="https://erova.com"
                  className="hover:text-neutral-200 transition"
                  target="_blank"
                  rel="noreferrer"
                >
                 erova.com
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}