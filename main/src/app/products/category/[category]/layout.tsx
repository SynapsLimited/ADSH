import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Define category translations for display (slugs to display names)
const CATEGORY_TRANSLATION_DISPLAY: Record<string, string> = {
  'dairy': 'Dairy',
  'ice-cream': 'Ice Cream',
  'pastry': 'Pastry',
  'bakery': 'Bakery',
  'packaging': 'Packaging',
  'equipment': 'Equipment',
};

/** Generate static parameters for pre-rendering */
export async function generateStaticParams() {
  // Pre-render only allowed category keys
  return Object.keys(CATEGORY_TRANSLATION_DISPLAY).map((key) => ({ category: key }));
}

/** Generate metadata dynamically based on the category parameter */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const normalizedCategory = category.toLowerCase();

  // Trigger 404 if the category is not recognized
  if (!CATEGORY_TRANSLATION_DISPLAY[normalizedCategory]) {
    notFound();
  }

  const displayName = CATEGORY_TRANSLATION_DISPLAY[normalizedCategory];
  const title = `${displayName} Products - ADSH`;
  const description = `Explore our range of ${displayName} products at ADSH, offering high-quality items for your needs.`;
  const imageUrl = `/assets/products-${normalizedCategory}.png`; // Adjust path as needed

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${displayName} Products`,
        },
      ],
    },
  };
}

/** Define the props interface for the layout component */
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}

/** Default layout component for product categories */
export default async function CategoryLayout({ children, params }: LayoutProps) {
  await params; // Resolve params if needed
  return <>{children}</>;
}