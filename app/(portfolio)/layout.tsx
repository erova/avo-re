import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Public_Sans } from "next/font/google";
import "./tokens.css";
import "./home.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["italic"],
  display: "swap",
  preload: true,
  variable: "--font-bodoni",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.avo.re"),
  title: "Chris Avore",
  description:
    "Design leadership for products that can't afford to be wrong.",
  // Draft stays out of search until the section 8 review pass in the brief.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bodoni.variable} ${publicSans.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
