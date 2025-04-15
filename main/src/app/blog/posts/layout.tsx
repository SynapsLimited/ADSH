import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Posts - ADSH Blog',
  description: 'Browse all articles on the ADSH blog.',
};

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}