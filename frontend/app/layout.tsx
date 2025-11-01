// app/layout.tsx

import "../styles/global.css"; // Ensure Tailwind's @tailwind directives are loaded first
import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Providers } from "@/components/providers";
import { Inter } from "next/font/google"; // 1. Import your font

// 2. Set up the font and assign it a CSS variable name
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "MediVault",
  description: "AI + Blockchain powered health record management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 3. Add the font variable to your <html> tag
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased">
        <Providers>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}