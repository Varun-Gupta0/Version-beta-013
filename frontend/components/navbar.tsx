"use client";

import Link from "next/link";
import DarkModeToggle from "./darkmodetoggle";
import { useState } from "react";

export default function Navbar() {
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-medical-DEFAULT flex items-center justify-center text-white font-bold">
            MW
          </div>
          <span className="font-semibold text-xl text-gray-900 dark:text-gray-100">MedWallet</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link 
            href="/features" 
            className="text-sm font-medium text-gray-700 hover:text-medical-DEFAULT dark:text-gray-200 dark:hover:text-medical-light transition-colors"
          >
            Features
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium text-gray-700 hover:text-medical-DEFAULT dark:text-gray-200 dark:hover:text-medical-light transition-colors"
          >
            About
          </Link>
          
          <div className="relative">
            <button
              onClick={() => setShowAuthMenu(!showAuthMenu)}
              className="text-sm font-medium text-medical-DEFAULT hover:text-medical-dark dark:text-medical-light dark:hover:text-white transition-colors"
            >
              Login / Register
            </button>
            
            {showAuthMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Select Account Type
                  </div>
                  <Link
                    href="/auth/patient"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-medical-light dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Patient Portal
                  </Link>
                  <Link
                    href="/auth/doctor"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-medical-light dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Doctor Portal
                  </Link>
                  <Link
                    href="/auth/lab"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-medical-light dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Laboratory Portal
                  </Link>
                </div>
              </div>
            )}
          </div>

          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
