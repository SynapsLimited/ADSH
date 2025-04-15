import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - ADSH',
  description: 'Get in touch with ADSH for inquiries or support.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}