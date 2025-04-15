import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authors - ADSH Blog',
  description: 'Meet the authors contributing to the ADSH blog.',
};

export default function AuthorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}