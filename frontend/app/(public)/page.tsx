'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, MessageCircle } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { PropertyCard, Property } from '@/components/public/PropertyCard';
import { FilterBar } from '@/components/public/FilterBar';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/api';

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const propsData = await fetchApi('/properties?featured=true');
        setFeaturedProperties(propsData);

        const distData = await fetchApi('/districts');
        setDistricts(distData);
      } catch (err) {
        console.error('Error loading home data:', err);
        setFeaturedProperties([
          {
            id: '1',
            title: 'Residencia Exclusiva en Baños del Inca',
            slug: 'residencia-exclusiva-en-banos-del-inca',
            location: 'Baños del Inca',
            price: 850000,
            operation: 'VENTA',
            type: 'casa',
            area: 450,
            beds: 4,
            baths: 5,
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            featured: true,
          },
          {
            id: '2',
            title: 'Departamento Moderno Cajamarca Centro',
            slug: 'departamento-moderno-cajamarca-centro',
            location: 'Cajamarca Centro',
            price: 2500,
            operation: 'ALQUILER',
            type: 'departamento',
            area: 120,
            beds: 2,
            baths: 2,
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
            featured: true,
          },
          {
            id: '3',
            title: 'Terreno Campestre Exclusivo Llacanora',
            slug: 'terreno-campestre-exclusivo-llacanora',
            location: 'Llacanora',
            price: 450000,
            operation: 'VENTA',
            type: 'terreno',
            area: 1200,
            beds: 0,
            baths: 0,
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
            featured: true,
          },
        ]);
        setDistricts([
          { id: '1', name: 'Baños del Inca', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600' },
          { id: '2', name: 'Cajamarca Centro', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600' },
          { id: '3', name: 'Llacanora', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600' },
          { id: '4', name: 'Santa Bárbara', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600' },
        ]);
      }
    }
    loadData();
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50">
        {/* HERO SECTION - LIGHT EDITORIAL THEME */}
        <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-16 overflow-hidden bg-slate-950">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2200&q=90"
              alt="ARTEVÍA Luxury Real Estate Cajamarca"
              fill
              priority
              className="object-cover brightness-60 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-slate-950/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
          </div>

          <div className="container mx-auto px-6 sm:px-10 z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-6 pt-6">
              <span className="text-xs font-medium uppercase tracking-[0.4em] text-slate-300 block">
                C A J A M A R C A , &nbsp; P E R Ú
              </span>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white leading-[1.08] tracking-tight">
                Espacios que <span className="font-serif italic font-normal text-[#c89b5c]">definen</span> el lujo
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-light max-w-xl leading-relaxed">
                Propiedades exclusivas en las zonas más codiciadas de Cajamarca. Experiencia, discreción y resultados.
              </p>

              {/* Inline Light Search Bar */}
              <div className="pt-6 max-w-4xl">
                <FilterBar />
              </div>
            </div>

            {/* Right Metrics Overlay Column */}
            <div className="lg:col-span-4 hidden lg:flex flex-col items-end text-right space-y-8 pr-4">
              <div>
                <span className="font-serif text-3xl md:text-4xl text-[#c89b5c] block font-light">12+</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-slate-300 font-medium block mt-0.5">
                  AÑOS DE EXPERIENCIA
                </span>
              </div>

              <div>
                <span className="font-serif text-3xl md:text-4xl text-[#c89b5c] block font-light">500+</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-slate-300 font-medium block mt-0.5">
                  PROPIEDADES VENDIDAS
                </span>
              </div>

              <div>
                <span className="font-serif text-3xl md:text-4xl text-[#c89b5c] block font-light">98%</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-slate-300 font-medium block mt-0.5">
                  CLIENTES SATISFECHOS
                </span>
              </div>

              <div>
                <span className="font-serif text-3xl md:text-4xl text-[#c89b5c] block font-light">Cajamarca</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-slate-300 font-medium block mt-0.5">
                  ZONAS PREMIUM
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PROPERTIES SECTION - LIGHT CARD THEME */}
        <section className="py-24 bg-white border-t border-slate-200">
          <div className="container mx-auto px-6 sm:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-[#c89b5c] font-semibold block">PORTAFOLIO</span>
                <h2 className="font-serif text-4xl sm:text-5xl text-slate-900 font-normal mt-2">Propiedades Destacadas</h2>
              </div>
              <Link href="/propiedades" className="mt-4 md:mt-0">
                <Button variant="outline" className="border-slate-800 text-slate-900 hover:border-[#c89b5c] hover:text-[#c89b5c] text-xs uppercase tracking-[0.2em] gap-2 py-5 px-6">
                  Ver Todo el Catálogo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        </section>

        {/* DISTRICTS SHOWCASE SECTION - LIGHT THEME */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-6 sm:px-10 text-center max-w-3xl mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-[#c89b5c] font-semibold block">UBICACIONES EXCLUSIVAS</span>
            <h2 className="font-serif text-4xl sm:text-5xl text-slate-900 font-normal mt-2">Zonas de Cajamarca</h2>
            <p className="text-slate-600 text-sm mt-3 font-light">
              Descubre residencias, casas de campo y terrenos en los sectores de mayor plusvalía de Cajamarca.
            </p>
          </div>

          <div className="container mx-auto px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {districts.map((dist) => (
              <Link key={dist.id} href={`/propiedades?location=${encodeURIComponent(dist.name)}`} className="group">
                <div className="relative h-80 rounded-2xl overflow-hidden border border-slate-200 group-hover:border-[#c89b5c] transition-all duration-500 shadow-md hover:shadow-xl">
                  <Image
                    src={dist.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'}
                    alt={dist.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-serif text-2xl text-white group-hover:text-[#c89b5c] transition-colors font-normal">
                      {dist.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-slate-300 mt-1 font-light">
                      Ver inmuebles <ChevronRight className="w-3.5 h-3.5 text-[#c89b5c]" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FLOATING WHATSAPP BUTTON */}
        <a
          href="https://wa.me/51965355800?text=Hola%20ARTEV%C3%8DA,%20deseo%20informaci%C3%B3n%20sobre%20sus%20propiedades%20exclusivas."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
        </a>
      </main>

      <Footer />
    </>
  );
}
