'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Maximize, MapPin, Star, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

export interface Property {
  id: string;
  title: string;
  slug: string;
  location: string;
  price: number | string;
  operation: 'VENTA' | 'ALQUILER';
  type: string;
  area: number;
  beds: number;
  baths: number;
  image: string;
  images?: string[];
  featured?: boolean;
  status?: string;
  address?: string;
  description?: string;
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const isVenta = property.operation === 'VENTA';
  
  // Collect all valid images for the property
  const allImages = property.images && property.images.length > 0 
    ? property.images 
    : (property.image ? [property.image] : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80']);
  
  const [currentIdx, setCurrentIdx] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="group overflow-hidden border border-slate-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl flex flex-col">
      {/* Image Container / Inline Mini-Carousel */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-100 select-none">
        <Link href={`/propiedades/${property.slug || property.id}`} className="block relative w-full h-full">
          <Image
            src={allImages[currentIdx]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10 pointer-events-none">
          <span className="bg-[#0f172a] text-white font-bold text-[10px] uppercase px-3 py-1 rounded-md tracking-wider shadow-sm">
            {isVenta ? 'EN VENTA' : 'EN ALQUILER'}
          </span>
          <span className="bg-[#0f172a] text-white font-bold text-[10px] uppercase px-3 py-1 rounded-md tracking-wider shadow-sm">
            {property.type}
          </span>
        </div>

        {property.featured && (
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <span className="bg-[#c89b5c] text-white font-bold text-[10px] uppercase px-3 py-1 rounded-md tracking-wider shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" /> DESTACADO
            </span>
          </div>
        )}

        {/* Photo count indicator */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <ImageIcon className="w-3 h-3" /> {currentIdx + 1} / {allImages.length}
          </div>
        )}

        {/* Carousel Navigation Arrows (Visible on hover if multiple images) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              title="Foto anterior"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              title="Siguiente foto"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bottom Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1 pointer-events-none">
              {allImages.slice(0, 5).map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    currentIdx === dotIdx ? 'bg-white w-3' : 'bg-white/50'
                  }`}
                />
              ))}
              {allImages.length > 5 && (
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              )}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c89b5c] mb-1.5 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            {property.location}
          </div>

          <h3 className="font-serif font-bold text-xl text-slate-900 line-clamp-1 mb-3 group-hover:text-[#c89b5c] transition-colors">
            {property.title}
          </h3>

          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 text-xs text-slate-600 mb-4">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{property.beds} Dorms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{property.baths} Baños</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-slate-400" />
              <span>{property.area} m²</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Precio</span>
            <p className="font-serif text-2xl font-bold text-slate-900">
              {formatPrice(property.price)}
              {!isVenta && <span className="text-xs font-normal text-slate-500">/mes</span>}
            </p>
          </div>

          <Link
            href={`/propiedades/${property.slug || property.id}`}
            className="text-xs font-semibold uppercase tracking-wider px-4 py-2 bg-slate-900 text-white hover:bg-[#c89b5c] rounded-md transition-colors shadow-sm"
          >
            Ver Detalle
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
