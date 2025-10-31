import type { Metadata } from "next";
import "./styles/globals.css";
import "./styles/theme.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DarkModeToggle } from "@/components/darkmodetoggle";
import { Toast } from "@/components/toast";
import { Loader } from "@/components/loader";

export const metadata: Metadata = {
  title: "Beta-13 | Full Dive VR Prototype",
  description: "Next-gen VR Interface built by Varun",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-grow relative">
          <DarkModeToggle />
          <Loader />
          {children}
        </div>
        <Footer />
        <Toast />
      </body>
    </html>
  );
}
