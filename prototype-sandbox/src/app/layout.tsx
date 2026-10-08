import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Öhlunds Brygga – Kulturarvsfröer & Snittblommor vid Ljusnan (Ljusdal)",
  description: "Kulturarvsfröer, snittblommor och bukettrecept från Öhlunds Brygga. Provodlat och handpackat vid Stugan i Hälsingland (Zon 5).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${newsreader.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-oat text-bark antialiased font-sans selection:bg-terracotta selection:text-white">
        {children}
      </body>
    </html>
  );
}
