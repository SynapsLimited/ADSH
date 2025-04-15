import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ADSH',
  description: 'Read our privacy policy to understand how we handle your data.',
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}