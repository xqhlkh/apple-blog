import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        display: [
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Helvetica Neue"',
          'Helvetica',
          'sans-serif',
        ],
      },
      colors: {
        apple: {
          bg: '#f5f5f7',
          card: '#ffffff',
          text: '#1d1d1f',
          secondary: '#86868b',
          accent: '#0071e3',
          'accent-hover': '#0077ed',
          border: '#d2d2d7',
        },
      },
      borderRadius: {
        'apple': '18px',
        'apple-sm': '12px',
      },
      boxShadow: {
        'apple': '0 4px 24px rgba(0, 0, 0, 0.04)',
        'apple-hover': '0 8px 40px rgba(0, 0, 0, 0.08)',
        'apple-btn': '0 2px 8px rgba(0, 113, 227, 0.3)',
      },
    },
  },
  plugins: [],
};
export default config;
