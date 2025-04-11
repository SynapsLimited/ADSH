import React from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FixedMenu from '@/components/FixedMenu';
import LatestSideBar from '@/components/LatestSideBar';
import CookieConsent from '@/components/CookieConsent';
import { UserProvider } from '@/context/userContext';
import ClientWrapper from '@/components/ClientWrapper';
import { Analytics } from '@vercel/analytics/react';
import Cookies from 'js-cookie';
import ScrollToTop from '@/components/ScrollToTop';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import I18nProvider from '@/components/I18nProvider';
import { Manjari, Nunito_Sans } from 'next/font/google';

// Initialize Google Fonts
const manjari = Manjari({
  subsets: ['latin'],
  weight: ['100', '400'],
  variable: '--font-manjari',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['700', '400'],
  variable: '--font-nunito-sans',
});

export const metadata = {
  title: {
    default: 'ADSH - Home',
    template: '%s - ADSH',
  },
  description: 'Welcome to ADSH - Explore our products, blog, and more!',
  keywords: [
    'ADSH',
    'Products',
    'Blog',
    'Contact',
    'Dairy',
    'Ice Cream',
    'Pastry',
    'Bakery',
    'Packaging',
    'Equipment',
    'Nuts',
  ],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'ADSH - Home',
    description: 'Discover ADSH products and insights.',
    url: 'https://www.adsh2014.al',
    type: 'website',
    images: [
      {
        url: 'https://www.adsh2014.al/assets/Homepage - Hero.jpg',
        width: 1200,
        height: 630,
        alt: 'ADSH',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ADSH',
    description: 'Explore ADSH products and blog.',
    images: ['https://www.adsh2014.al/assets/Homepage - Hero.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manjari.variable} ${nunitoSans.variable}`}>
      <body>
        <UserProvider>
          <I18nProvider>
            <Navbar />
            <LatestSideBar />
            <FixedMenu />
            <ScrollToTop />
            <BackgroundAnimation />
            <ClientWrapper>
              {children}
              <Footer />
            </ClientWrapper>
            <CookieConsent />
            {Cookies.get('adshCookieConsent') === 'true' && <Analytics />}
          </I18nProvider>
        </UserProvider>
      </body>
    </html>
  );
}