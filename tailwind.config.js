/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        background: '#060a0d',
        foreground: '#F5F5F5',
        primary: '#00bcd4',
        secondary: '#0ea5a4',
        tertiary: '#164e63',
        card: '#0f1720',
        border: '#1e293b',
        muted: '#111827',
        'muted-foreground': '#94a3b8',
        success: '#22c55e',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
};
