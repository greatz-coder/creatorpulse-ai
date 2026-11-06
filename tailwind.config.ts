import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: '#8b5cf6',
        dark: '#0b0b12',
        panel: '#141421',
        accent: '#a78bfa',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139, 92, 246, 0.4), 0 18px 50px rgba(139, 92, 246, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
