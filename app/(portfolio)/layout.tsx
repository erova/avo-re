import type { Metadata, Viewport } from "next";
import { Gloock, Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";
import "./tokens.css";
import "./home.css";

const gloock = Gloock({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
  variable: "--font-gloock",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-source-serif",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-schibsted",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${process.env.PORTFOLIO_HOST ?? "chris.avo.re"}`),
  alternates: { canonical: "/" },
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
    <html lang="en" className={`${gloock.variable} ${sourceSerif.variable} ${schibsted.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
