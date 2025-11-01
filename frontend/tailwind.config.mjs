/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          foreground: '#ffffff',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          DEFAULT: '#22c55e',
          foreground: '#ffffff',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: '#FF6B6B',
        border: '#e5e7eb',
        medical: {
          light: '#E3F2FD',
          DEFAULT: '#2196F3',
          dark: '#1565C0',
        }
      },
      fontFamily: {
        // 4. This line connects Tailwind's 'sans' to your font
        sans: ["var(--font-sans)", "sans-serif"],
      },
      // ... your other theme extensions
    },
  },
  plugins: [],
};
export default config;