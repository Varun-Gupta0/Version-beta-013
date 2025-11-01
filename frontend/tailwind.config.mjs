// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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