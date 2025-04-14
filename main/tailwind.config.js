/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: 'var(--color-primary)', // #ED205A
          secondary: 'var(--color-secondary)', // #393939
          tertiary: 'var(--color-tertiary)', // #F5F5F5
          complementary: 'var(--color-complementary)', // #D9D9D9
          white: 'var(--color-white)', // #FFFFFF
          background: 'var(--color-background)', // #FFFFFF
          'primary-transparent': 'var(--color-primary-transparent)', // rgba(237, 32, 90, 0.7)
          'primary-transparent-sidebar': 'var(--color-primary-transparent-sidebar)', // rgba(237, 32, 90, 0.25)
          'primary-transparent-sidebar-hover': 'var(--color-primary-transparent-sidebar-hover)', // rgba(237, 32, 90, 0.35)
          'secondary-transparent': 'var(--color-secondary-transparent)', // rgba(57, 57, 57, 0.9)
          'secondary-transparent-sidebar': 'var(--color-secondary-transparent-sidebar)', // rgba(57, 57, 57, 0.2)
          'tertiary-transparent': 'var(--color-tertiary-transparent)', // rgba(245, 245, 245, 0.7)
          'complementary-transparent': 'var(--color-complementary-transparent)', // rgba(217, 217, 217, 0.7)
          'white-transparent': 'var(--color-white-transparent)', // rgba(255, 255, 255, 0.7)
          'background-transparent': 'var(--color-background-transparent)', // rgba(255, 255, 255, 0.7)
        },
        fontFamily: {
          manjari: ['Manjari', 'sans-serif'],
          nunito: ['Nunito Sans', 'sans-serif'],
        },
        container: {
          center: true,
          padding: '1rem',
          screens: {
            sm: 'var(--container-width-sm)', // 94%
            md: 'var(--container-width-md)', // 90%
            lg: 'var(--container-width-lg)', // 86%
          },
        },
        transitionProperty: {
          'all': 'var(--transition)', // all 400ms ease
        },
      },
    },
    plugins: [],
  };