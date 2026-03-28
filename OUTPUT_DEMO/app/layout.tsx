import type { Metadata } from 'next';
import './globals.css';

import { Inter } from 'next/font/google';
const interFont = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
import { JetBrains_Mono } from 'next/font/google';
const jetBrainsMonoFont = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: 'Stitch App',
  description: 'Generated from Google Stitch',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${interFont.className} ${jetBrainsMonoFont.className}`}>{children}</body>
    </html>
  );
}
