// app/layout.tsx
import "../styles/global.css"; // Ensure Tailwind's @tailwind directives are loaded first
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
