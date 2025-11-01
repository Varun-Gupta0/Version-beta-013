"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button 
        className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center"
        aria-label="Loading theme toggle"
      >
        <span className="sr-only">Loading theme</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-medical-light dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5 text-medical-DEFAULT" />
      ) : (
        <Moon className="h-5 w-5 text-medical-dark" />
      )}
    </button>
  );
}
