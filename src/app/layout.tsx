import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getTokenPrice } from "./lib/fetchTokenPirce";
import { PostHogProvider } from "./components/PostHogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  console.log('Generating metadata...');
  const priceData = await getTokenPrice();
  console.log('Price data for metadata:', priceData);
  
  return {
    title: `HOUSECOIN ${priceData.uiFormatted ?? '$0.000'}`,
    description: "HOUSECOIN IS NOT A HOUSE, ITS A HOME 🏠",
    openGraph: {
      title: `HOUSECOIN ${priceData.uiFormatted ?? '$0.000'}`,
      description: "HOUSECOIN IS NOT A HOUSE, ITS A HOME 🏠",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
