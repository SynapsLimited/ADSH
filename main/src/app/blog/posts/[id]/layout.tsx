import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/** Generate static parameters for pre-rendering */
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts`, { cache: 'no-cache' });
  if (!res.ok) return [];
  const posts = await res.json();
  return posts.map((post: any) => ({ id: post._id }));
}

/** Generate metadata dynamically based on the post id */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${id}`, { cache: 'no-cache' });
  if (!res.ok) {
    notFound();
  }
  const post = await res.json();
  const MAX_TITLE_LENGTH = 40;
  const title = post.title.length > MAX_TITLE_LENGTH ? post.title.slice(0, MAX_TITLE_LENGTH) + '...' : post.title;
  const fullTitle = `${title} - ADSH Blog`;
  const imageUrl = post.thumbnail || '/assets/Blog-default.webp';
  const plainDescription = stripHtml(post.description);
  const truncatedDescription = truncateWords(plainDescription, 80);

  return {
    title: fullTitle,
    description: truncatedDescription,
    openGraph: {
      title: fullTitle,
      description: truncatedDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

/** Utility function to strip HTML tags */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

/** Utility function to truncate text by word count */
function truncateWords(text: string, wordLimit: number): string {
  const words = text.split(/\s+/);
  return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
}

/** Define the props interface for the layout component */
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

/** Default layout component for blog posts */
export default async function PostLayout({ children, params }: LayoutProps) {
  await params; // Resolve params if needed
  return <>{children}</>;
}