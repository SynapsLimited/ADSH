import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Define allowed categories for display
const CATEGORY_TRANSLATION_DISPLAY: Record<string, string> = {
  'Dairy': 'Dairy',
  'Ice Cream': 'Ice Cream',
  'Pastry': 'Pastry',
  'Bakery': 'Bakery',
  'Packaging': 'Packaging',
  'Equipment': 'Equipment',
  'Other': 'Other',
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

  // Trigger 404 if the category is not recognized
  if (!CATEGORY_TRANSLATION_DISPLAY[category]) {
    notFound();
  }

  const displayName = CATEGORY_TRANSLATION_DISPLAY[category];
  const title = `Posts in ${displayName} - ADSH Blog`;
  const description = `Explore posts in the ${displayName} category on ADSH blog, offering insights and updates.`;
  const imageUrl = `/assets/blog-${displayName.toLowerCase().replace(' ', '-')}.png`; // Adjust path as needed

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
          alt: `${displayName} Posts`,
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

/** Default layout component for blog categories */
export default async function CategoryLayout({ children, params }: LayoutProps) {
  await params; // Resolve params if needed
  return <>{children}</>;
}