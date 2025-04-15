import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - ADSH',
  description: 'Explore the latest articles and insights from ADSH.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}