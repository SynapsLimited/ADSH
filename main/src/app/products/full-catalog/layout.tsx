import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Full Catalog - ADSH',
  description: 'Browse our complete catalog of products.',
};

export default function FullCatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}