import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - ADSH',
  description: 'Discover our range of products across various categories.',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}