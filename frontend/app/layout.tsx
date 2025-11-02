// app/layout.tsx
// app/layout.tsx
import "../styles/global.css"; // Ensure Tailwind's @tailwind directives are loaded first
import React from "react"; // Ensure Tailwind's @tailwind directives are loaded first
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Providers } from "@/components/providers";
import AiAssistant from "@/components/AiAssistant";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <AiAssistant />
        </Providers>
      </body>
    </html>
  );
}
