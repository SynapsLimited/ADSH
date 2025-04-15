import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Define the Post interface
interface Post {
  creator: {
    _id: string;
    // Add other properties if needed
  };
  // Add other post properties if needed
}

/** Generate static parameters for pre-rendering */
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts`, { cache: 'no-cache' });
  if (!res.ok) return [];
  const posts: Post[] = await res.json(); // Type the API response
  const authorIds = [...new Set(posts.map((post) => post.creator._id))];
  return authorIds.map((id) => ({ id }));
}

/** Generate metadata dynamically */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`, { cache: 'no-cache' });
  if (!res.ok) {
    notFound();
  }
  const author = await res.json();
  const title = `Posts by ${author.name} - ADSH Blog`;
  return {
    title,
    description: `Explore posts by ${author.name} on ADSH blog.`,
  };
}

/** Layout props interface */
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

/** Default layout component */
export default async function AuthorLayout({ children, params }: LayoutProps) {
  await params; // Resolve params if needed
  return <>{children}</>;
}