import type { Config } from "tailwindcss";

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        complementary: 'var(--color-complementary)',
        white: 'var(--color-white)',
        background: 'var(--color-background)',
        'primary-transparent': 'var(--color-primary-transparent)',
        'primary-transparent-sidebar': 'var(--color-primary-transparent-sidebar)',
        'primary-transparent-sidebar-hover': 'var(--color-primary-transparent-sidebar-hover)',
        'secondary-transparent': 'var(--color-secondary-transparent)',
        'secondary-transparent-sidebar': 'var(--color-secondary-transparent-sidebar)',
        'tertiary-transparent': 'var(--color-tertiary-transparent)',
        'complementary-transparent': 'var(--color-complementary-transparent)',
        'white-transparent': 'var(--color-white-transparent)',
        'background-transparent': 'var(--color-background-transparent)',
      },
      fontFamily: {
        manjari: ['Manjari', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: 'var(--container-width-sm)',
          md: 'var(--container-width-md)',
          lg: 'var(--container-width-lg)',
        },
      },
      transitionProperty: {
        all: 'var(--transition)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(237, 32, 90, 0.7)' },
          '70%': { boxShadow: '0 0 0 6px rgba(237, 32, 90, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(237, 32, 90, 0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
