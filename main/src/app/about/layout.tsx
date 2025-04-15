import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - ADSH',
  description: 'Learn more about ADSH, our mission, vision, and values.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}