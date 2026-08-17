'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Award, Shield, Target, Phone, Mail } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { fetchApi } from '@/lib/api';

export default function NosotrosPage() {
  const [reps, setReps] = useState<any[]>([]);

  useEffect(() => {
    async function loadReps() {
      try {
        const data = await fetchApi('/reps');
        setReps(data);
      } catch (err) {
        console.error('Error fetching reps:', err);
        setReps([
          {
            id: '1',
            name: 'Alejandro Vargas',
            role: 'DIRECTOR GENERAL',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600',
            email: 'arteviainmobiliaria@gmail.com',
            phone: '+51 965 355 800',
          },
          {
            id: '2',
            name: 'Valentina Torres',
            role: 'DIRECTORA COMERCIAL',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
            email: 'arteviainmobiliaria@gmail.com',
            phone: '+51 965 355 800',
          },
          {
            id: '3',
            name: 'Carlos Mendoza',
            role: 'AGENTE SENIOR',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600',
            email: 'arteviainmobiliaria@gmail.com',
            phone: '+51 965 355 800',
          },
        ]);
      }
    }
    loadReps();
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex-1 pt-28 pb-24 bg-slate-50 text-slate-900">
        {/* Hero Banner */}
        <section className="relative h-64 flex items-center overflow-hidden bg-slate-950 mb-20">
          <Image
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80"
            alt="Nosotros ARTEVÍA"
            fill
            className="object-cover brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
          <div className="container mx-auto px-6 sm:px-10 z-10">
            <span className="text-xs uppercase tracking-[0.35em] text-[#c89b5c] font-semibold block mb-2">
              NUESTRA FILOSOFÍA
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-white font-normal">Acerca de ARTEVÍA</h1>
          </div>
        </section>

        <div className="container mx-auto px-6 sm:px-10">
          {/* Intro */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
            <p className="text-slate-600 text-base leading-relaxed font-light">
              Somos una firma inmobiliaria dedicada a conectar a nuestros clientes con las residencias e
              inversiones corporativas más cotizadas del país. Con más de 12 años de trayectoria, trabajamos
              con discreción, estrategia y excelencia.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-8 text-center space-y-4 rounded-2xl">
              <div className="w-14 h-14 rounded-xl bg-[#c89b5c]/10 border border-[#c89b5c]/30 flex items-center justify-center text-[#c89b5c] mx-auto">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-normal text-slate-900">Seguridad Jurídica</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Cada propiedad en nuestro catálogo pasa por un riguroso estudio de títulos y verificación registral antes de ser publicada.
              </p>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-8 text-center space-y-4 rounded-2xl">
              <div className="w-14 h-14 rounded-xl bg-[#c89b5c]/10 border border-[#c89b5c]/30 flex items-center justify-center text-[#c89b5c] mx-auto">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-normal text-slate-900">Negociación Estratégica</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Maximizamos el retorno de inversión para vendedores y aseguramos condiciones óptimas para compradores e inversores.
              </p>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-8 text-center space-y-4 rounded-2xl">
              <div className="w-14 h-14 rounded-xl bg-[#c89b5c]/10 border border-[#c89b5c]/30 flex items-center justify-center text-[#c89b5c] mx-auto">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-normal text-slate-900">Atención Exclusiva</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Asignamos un consultor senior dedicado que gestionará cada etapa del proceso con confidencialidad absoluta.
              </p>
            </Card>
          </div>

          {/* Team Representatives */}
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-[0.3em] text-[#c89b5c] font-semibold block">
                EJECUTIVOS DE ALTO NIVEL
              </span>
              <h2 className="font-serif text-4xl text-slate-900 font-normal mt-2">Nuestro Equipo</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reps.map((rep) => (
                <Card key={rep.id} className="bg-white border border-slate-200 overflow-hidden group rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image
                      src={rep.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600'}
                      alt={rep.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <CardContent className="p-6 space-y-2 text-center border-t border-slate-100">
                    <h3 className="font-serif text-xl font-normal text-slate-900">{rep.name}</h3>
                    <span className="text-[10px] font-semibold text-[#c89b5c] uppercase tracking-[0.25em] block">
                      {rep.role}
                    </span>
                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-500 font-light">
                      {rep.phone && <p className="flex items-center justify-center gap-2"><Phone className="w-3.5 h-3.5 text-[#c89b5c]" /> {rep.phone}</p>}
                      {rep.email && <p className="flex items-center justify-center gap-2"><Mail className="w-3.5 h-3.5 text-[#c89b5c]" /> {rep.email}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
