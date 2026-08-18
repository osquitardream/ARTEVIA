'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { fetchApi } from '@/lib/api';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio (mínimo 2 caracteres)'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, 'El mensaje debe tener al menos 5 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

function ContactFormContent() {
  const searchParams = useSearchParams();
  const propertyParam = searchParams.get('property');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    if (propertyParam) {
      setValue('subject', `Consulta sobre propiedad: ${propertyParam}`);
      setValue('message', `¡Hola! Deseo recibir información detallada y coordinar una visita para la propiedad "${propertyParam}".`);
    }
  }, [propertyParam, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      await fetchApi('/contacts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success('¡Mensaje enviado con éxito! Te contactaremos a la brevedad.');
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Error al enviar el mensaje');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
      {/* Info Column */}
      <div className="space-y-6">
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
          <h3 className="font-serif text-xl font-normal text-slate-900 border-b border-slate-100 pb-3">
            Canales de Atención
          </h3>
          <ul className="space-y-5 text-sm text-slate-600 font-light">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#c89b5c] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider mb-0.5">Ubicación y Cobertura</span>
                <span>Cajamarca, Perú — Atención Digital y Visitas Coordinadas</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#c89b5c] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider mb-0.5">Teléfono / WhatsApp</span>
                <a href="https://wa.me/51965355800" target="_blank" rel="noreferrer" className="text-slate-700 hover:text-[#c89b5c] font-medium transition-colors">
                  +51 965 355 800
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#c89b5c] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider mb-0.5">Correo Electrónico</span>
                <a href="mailto:arteviainmobiliaria@gmail.com" className="text-slate-700 hover:text-[#c89b5c] font-medium transition-colors">
                  arteviainmobiliaria@gmail.com
                </a>
              </div>
            </li>
          </ul>
        </Card>

        {/* Hours */}
        <Card className="bg-[#c89b5c]/5 border border-[#c89b5c]/20 rounded-2xl p-6 space-y-3">
          <h4 className="font-serif text-base font-normal text-slate-800">Horario de Atención</h4>
          <div className="text-xs text-slate-600 space-y-1.5 font-light">
            <p className="flex justify-between"><span>Lun – Vie</span><span className="font-medium text-slate-800">9:00 – 18:00</span></p>
            <p className="flex justify-between"><span>Sábado</span><span className="font-medium text-slate-800">9:00 – 13:00</span></p>
            <p className="flex justify-between"><span>Domingo</span><span className="text-slate-400">Cerrado</span></p>
          </div>
        </Card>
      </div>

      {/* Form Column */}
      <div className="lg:col-span-2">
        <Card className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="font-serif text-2xl font-normal text-slate-900 mb-6 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#c89b5c]" />
            Formulario de Consulta
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nombre Completo *
                </label>
                <Input
                  placeholder="Ej: Juan Pérez"
                  {...register('name')}
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#c89b5c] focus:ring-[#c89b5c]/20"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Correo Electrónico *
                </label>
                <Input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  {...register('email')}
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#c89b5c] focus:ring-[#c89b5c]/20"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Teléfono / Celular
                </label>
                <Input
                  placeholder="+51 900 000 000"
                  {...register('phone')}
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#c89b5c]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Asunto / Interés
                </label>
                <Input
                  placeholder="Ej: Consulta por Inmueble en Baños del Inca"
                  {...register('subject')}
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#c89b5c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Mensaje o Detalles *
              </label>
              <textarea
                rows={5}
                placeholder="Describe tu solicitud o especificaciones del inmueble que buscas..."
                {...register('message')}
                className="w-full rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c89b5c]/20 focus:border-[#c89b5c] transition-colors"
              />
              {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full justify-center gap-2 bg-[#c89b5c] hover:bg-[#b58a4b] text-white py-6 text-xs uppercase tracking-widest font-semibold"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function ContactoPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 pt-28 pb-24 bg-slate-50 text-slate-900">
        {/* Hero Banner */}
        <section className="relative h-64 flex items-center overflow-hidden bg-slate-950 mb-20">
          <Image
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80"
            alt="Contacto ARTEVÍA"
            fill
            className="object-cover brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
          <div className="container mx-auto px-6 sm:px-10 z-10">
            <span className="text-xs uppercase tracking-[0.35em] text-[#c89b5c] font-semibold block mb-2">
              ATENCIÓN PERSONALIZADA
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-white font-normal">Contáctate con ARTEVÍA</h1>
          </div>
        </section>

        <div className="container mx-auto px-6 sm:px-10">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-slate-600 text-sm font-light leading-relaxed">
              Déjanos tu requerimiento o consulta sobre una propiedad y te responderemos en menos de 24 horas.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-12 text-slate-400">Cargando formulario...</div>}>
            <ContactFormContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
