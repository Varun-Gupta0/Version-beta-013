"use client";

import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

/**
 * Global Providers Wrapper
 * - Handles dark/light theme
 * - Handles toast notifications
 * - Add future providers here (e.g., AI context, user session, etc.)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      value={{
        light: "light",
        dark: "dark"
      }}
    >
      {children}

      {/* Toast notifications (top-right corner) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
}
