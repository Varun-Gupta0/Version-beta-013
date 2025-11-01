"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        {/* Left side — logo and text */}
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="h-6 w-6 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold">Mv</div>
          <span className="font-semibold text-gray-800 dark:text-gray-200">MediVault</span>
          <span className="text-gray-500 dark:text-gray-400">© {new Date().getFullYear()}</span>
        </div>

        {/* Right side — links */}
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-blue-500 transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-blue-500 transition-colors">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-blue-500 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
