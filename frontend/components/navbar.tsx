"use client";

import Link from "next/link";
import DarkModeToggle from "./darkmodetoggle";

export default function Navbar() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold">Mv</div>
          <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">MediVault</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-700 dark:text-gray-200">Dashboard</Link>
          <Link href="/login" className="text-sm text-gray-700 dark:text-gray-200">Login</Link>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
