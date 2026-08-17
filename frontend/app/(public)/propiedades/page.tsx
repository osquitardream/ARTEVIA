'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { PropertyCard, Property } from '@/components/public/PropertyCard';
import { FilterBar } from '@/components/public/FilterBar';
import { useFilterStore } from '@/store/useFilterStore';
import { fetchApi } from '@/lib/api';

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { search, operation, type, location } = useFilterStore();

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (operation && operation !== 'all') queryParams.append('operation', operation);
        if (type && type !== 'all') queryParams.append('type', type);
        if (location && location !== 'all') queryParams.append('location', location);

        const data = await fetchApi(`/properties?${queryParams.toString()}`);
        setProperties(data);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, [search, operation, type, location]);

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50 pt-20">
        {/* Banner Portafolio Propiedades Exclusivas - Matching New Image */}
        <section className="relative h-72 sm:h-80 w-full flex items-center overflow-hidden bg-slate-950">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="Portafolio ARTEVÍA"
            fill
            priority
            className="object-cover brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />

          <div className="container mx-auto px-6 sm:px-10 z-10">
            <span className="text-xs uppercase tracking-[0.35em] text-[#c89b5c] font-semibold block mb-2">
              PORTAFOLIO
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-normal">
              Propiedades exclusivas
            </h1>
          </div>
        </section>

        {/* Filter Bar & Grid Section */}
        <section className="py-10">
          <div className="container mx-auto px-6 sm:px-10">
            <div className="mb-10">
              <FilterBar totalResults={properties.length} />
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-500 font-medium">Cargando catálogo de propiedades...</div>
            ) : properties.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xl text-slate-800 font-serif font-bold mb-2">No se encontraron propiedades</p>
                <p className="text-sm text-slate-500 font-light">Prueba ajustando o limpiando los filtros de búsqueda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
