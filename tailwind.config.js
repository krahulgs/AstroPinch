/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        primary: 'var(--color-primary)',
        success: 'var(--color-success)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-primary': 'var(--color-text-primary)',
      },
    },
  },
  plugins: [],
}
