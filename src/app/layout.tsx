import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';

const URL = process.env.NEXT_PUBLIC_API_URL!;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function getTokenPrice() {
  try {
    const response = await fetch(`${URL}/api/price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        outputMint: '2whk1mdgozfgh8v5G2KS22UVdE8NS3JiaGcXz6Pepump'
      }),
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error fetching price:', error);
    return { price: 0, uiFormatted: '$0.000', confidenceLevel: 'low' };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const priceData = await getTokenPrice();
  
  return {
    title: `HOUSECOIN ${priceData.uiFormatted ?? '0.000'}`,
    description: "HOUSECOIN IS NOT A HOUSE, ITS A HOME 🏠",
    openGraph: {
      title: `HOUSECOIN ${priceData.uiFormatted ?? '0.000'}`,
      description: "HOUSECOIN IS NOT A HOUSE, ITS A HOME 🏠",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
