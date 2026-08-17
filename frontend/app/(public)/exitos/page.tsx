'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { fetchApi } from '@/lib/api';

export default function ExitosPage() {
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    async function loadStories() {
      try {
        const data = await fetchApi('/stories');
        setStories(data);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setStories([
          {
            id: '1',
            title: 'Venta Récord Residencia La Molina',
            description: 'Logramos la transacción y cierre de venta en menos de 15 días con total satisfacción del cliente vendedor y comprador.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
            clientName: 'Familia Ramírez',
          },
          {
            id: '2',
            title: 'Alquiler Corporativo San Isidro',
            description: 'Asesoría integral para la colocación de oficinas de alta gama a una multinacional tecnológica con contrato plurianual.',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
            clientName: 'TechCorp International',
          },
          {
            id: '3',
            title: 'Departamento Premium Miraflores',
            description: 'Gestión completa del proceso de venta, desde tasación hasta firma notarial, en un tiempo récord de 10 días hábiles.',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            clientName: 'Sr. Gustavo Pimentel',
          },
        ]);
      }
    }
    loadStories();
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex-1 pt-28 pb-24 bg-slate-50 text-slate-900">
        {/* Hero Banner */}
        <section className="relative h-64 flex items-center overflow-hidden bg-slate-950 mb-20">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="Éxitos ARTEVÍA"
            fill
            className="object-cover brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
          <div className="container mx-auto px-6 sm:px-10 z-10">
            <span className="text-xs uppercase tracking-[0.35em] text-[#c89b5c] font-semibold block mb-2">
              HITOS &amp; RESULTADOS
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-white font-normal">Casos de Éxito</h1>
          </div>
        </section>

        <div className="container mx-auto px-6 sm:px-10">
          {/* Intro */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-slate-600 text-sm font-light leading-relaxed">
              Transacciones destacadas y testimonios de quienes confían en nuestra gestión inmobiliaria.
            </p>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {stories.map((story) => (
              <Card key={story.id} className="bg-white border border-slate-200 overflow-hidden group rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={story.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-serif text-xl font-normal text-slate-900 group-hover:text-[#c89b5c] transition-colors leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-light">
                    {story.description}
                  </p>
                  {story.clientName && (
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#c89b5c] uppercase tracking-wider">
                      <Quote className="w-4 h-4" /> Cliente: {story.clientName}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
