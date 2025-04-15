import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/** Generate static parameters for pre-rendering */
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, { cache: 'no-cache' });
  if (!res.ok) return [];
  const products = await res.json();
  return products.map((product: any) => ({ slug: product.slug }));
}

/** Generate metadata dynamically based on the product slug */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`, { cache: 'no-cache' });
  if (!res.ok) {
    notFound();
  }
  const product = await res.json();
  const MAX_TITLE_LENGTH = 40;
  const name = product.name_en || product.name;
  const title = name.length > MAX_TITLE_LENGTH ? name.slice(0, MAX_TITLE_LENGTH) + '...' : name;
  const fullTitle = `${title} - ADSH`;
  const descriptionText = product.description_en || product.description;
  const truncatedDescription = truncateWords(descriptionText, 80);
  const imageUrl = product.images[0] || '/assets/product-default.png';

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
          alt: name,
        },
      ],
    },
  };
}

/** Utility function to truncate text by word count */
function truncateWords(text: string, wordLimit: number): string {
  const words = text.split(/\s+/);
  return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
}

/** Define the props interface for the layout component */
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

/** Default layout component for product details */
export default async function ProductLayout({ children, params }: LayoutProps) {
  await params; // Resolve params if needed
  return <>{children}</>;
}