import { Metadata } from 'next';
import PropertyDetailClient from './PropertyDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function getPropertyData(identifier: string) {
  try {
    const res = await fetch(`${API_URL}/properties/${identifier}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching property for metadata:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyData(id);

  if (!property) {
    return {
      title: 'Propiedad no encontrada | ARTEVÍA Inmobiliaria',
      description: 'Consulta nuestro catálogo de inmuebles exclusivos en Cajamarca, Perú.',
    };
  }

  const primaryImage =
    property.image ||
    (property.images && property.images.length > 0 ? property.images[0] : '') ||
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200';

  const title = `${property.title} — ${property.location} | ARTEVÍA`;
  const description =
    property.description?.trim().slice(0, 160) ||
    `${property.type} en ${property.operation} en ${property.location}. Conoce todas sus características e imágenes exclusivas.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      type: 'website',
      siteName: 'ARTEVÍA Inmobiliaria',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [primaryImage],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyData(id);

  return <PropertyDetailClient initialProperty={property} propertyId={id} />;
}
