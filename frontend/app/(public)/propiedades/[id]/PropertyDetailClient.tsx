'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  ArrowLeft,
  Phone,
  Mail,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ImageIcon,
} from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { fetchApi } from '@/lib/api';

interface PropertyDetailClientProps {
  initialProperty?: any;
  propertyId: string;
}

export default function PropertyDetailClient({ initialProperty, propertyId }: PropertyDetailClientProps) {
  const [property, setProperty] = useState<any>(initialProperty || null);
  const [loading, setLoading] = useState(!initialProperty);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      if (initialProperty) return;
      if (!propertyId) return;
      try {
        const data = await fetchApi(`/properties/${propertyId}`);
        setProperty(data);
        setCurrentIdx(0);
      } catch (err) {
        console.error('Error fetching property detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [propertyId, initialProperty]);

  // Image list resolution
  const allImages: string[] = property
    ? property.images && property.images.length > 0
      ? property.images
      : property.image
      ? [property.image]
      : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000']
    : [];

  const handlePrev = useCallback(() => {
    if (allImages.length <= 1) return;
    setCurrentIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    if (allImages.length <= 1) return;
    setCurrentIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Keyboard navigation for carousel & modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 pt-32 text-center text-slate-500 font-medium">
          Cargando detalles de la propiedad...
        </div>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 pt-32 text-center text-slate-700">
          <p className="text-xl font-bold font-serif mb-4">Propiedad no encontrada</p>
          <Link href="/propiedades">
            <Button className="bg-[#c89b5c] text-white hover:bg-[#b58a4b]">Volver al Catálogo</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Handle WhatsApp Click cleanly on client side to prevent any SSR hydration mismatch
  const handleWhatsAppContact = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const cleanDesc = property.description ? property.description.trim().slice(0, 140) : '';
    
    // Get primary image for direct preview
    const primaryImg =
      (property.images && property.images.length > 0 ? property.images[0] : null) ||
      property.image ||
      '';

    // Only attach image link if it's a valid public HTTP/HTTPS URL (prevent huge 100KB Base64 data strings that break WhatsApp URLs)
    const isCleanHttpUrl = primaryImg && (primaryImg.startsWith('http://') || primaryImg.startsWith('https://')) && !primaryImg.startsWith('data:');
    const photoSection = isCleanHttpUrl ? `\n📸 *Foto:* ${primaryImg}` : '';

    const text = `¡Hola! Vengo desde el portal de ARTEVÍA y deseo información sobre esta propiedad:

🏠 *${property.title}*
📍 *Ubicación:* ${property.location}${property.address ? ` - ${property.address}` : ''}
💵 *Precio:* ${formatPrice(property.price)} (${property.operation})
📐 *Área:* ${property.area} m² | 🛏 ${property.beds} Dorms | 🚿 ${property.baths} Baños
${cleanDesc ? `\n📋 *Detalle:* "${cleanDesc}"` : ''}${photoSection}

🌐 *Ver ficha completa en la web:*
${currentUrl}

¿Podrían brindarme mayor información y disponibilidad para coordinar una visita?`;

    // Universal WhatsApp link: Opens installed desktop app on PC / native app on phones, with fallback to WhatsApp Web
    const targetUrl = `https://api.whatsapp.com/send?phone=51965355800&text=${encodeURIComponent(text)}`;

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 pt-28 pb-20 bg-slate-50 text-slate-900">
        <div className="container mx-auto px-6 sm:px-10">
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-[#c89b5c] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Propiedades
          </Link>

          {/* Header info */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#0f172a] text-white font-bold text-[10px] uppercase px-3 py-1 rounded-md tracking-wider">
                  {property.operation}
                </span>
                <span className="text-xs text-[#c89b5c] font-semibold uppercase tracking-wider">
                  {property.type}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900">
                {property.title}
              </h1>
              <p className="text-slate-600 flex items-center gap-2 mt-2 text-sm">
                <MapPin className="w-4 h-4 text-[#c89b5c]" />
                {property.location} {property.address ? `- ${property.address}` : ''}
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Precio</span>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                {formatPrice(property.price)}
              </span>
            </div>
          </div>

          {/* Gallery & Sidebar layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── GALLERY & CAROUSEL COLUMN ────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main Carousel Hero Image */}
              <div className="group relative h-[420px] sm:h-[480px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 select-none">
                <Image
                  src={allImages[currentIdx]}
                  alt={`${property.title} - Foto ${currentIdx + 1}`}
                  fill
                  priority
                  className="object-cover cursor-pointer transition-all duration-300 group-hover:scale-102"
                  onClick={() => setIsLightboxOpen(true)}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Photo counter & expand button */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                  <div className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
                    <ImageIcon className="w-3.5 h-3.5 text-[#c89b5c]" />
                    <span>
                      {currentIdx + 1} / {allImages.length}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-[#c89b5c] transition-colors shadow"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Ver Galería Completa</span>
                  </button>
                </div>

                {/* Carousel Navigation Buttons */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      title="Foto anterior (Flecha Izquierda)"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      title="Foto siguiente (Flecha Derecha)"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails strip */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                  {allImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`relative w-24 h-18 sm:w-28 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        currentIdx === idx
                          ? 'border-[#c89b5c] ring-2 ring-[#c89b5c]/40 scale-105 shadow-md'
                          : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      <Image src={img} alt={`Miniatura ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Specifications Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 grid grid-cols-3 gap-4 text-center my-6 shadow-sm">
                <div>
                  <Bed className="w-6 h-6 text-[#c89b5c] mx-auto mb-1" />
                  <span className="block font-serif text-2xl font-bold text-slate-900">{property.beds}</span>
                  <span className="text-xs text-slate-500 font-medium">Dormitorios</span>
                </div>
                <div>
                  <Bath className="w-6 h-6 text-[#c89b5c] mx-auto mb-1" />
                  <span className="block font-serif text-2xl font-bold text-slate-900">{property.baths}</span>
                  <span className="text-xs text-slate-500 font-medium">Baños</span>
                </div>
                <div>
                  <Maximize className="w-6 h-6 text-[#c89b5c] mx-auto mb-1" />
                  <span className="block font-serif text-2xl font-bold text-slate-900">{property.area} m²</span>
                  <span className="text-xs text-slate-500 font-medium">Superficie Total</span>
                </div>
              </div>

              {/* Description & Dynamic Features */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="font-serif text-2xl font-normal text-slate-900">Descripción de la Propiedad</h3>
                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line font-light">
                  {property.description ||
                    'Excelente inmueble en ubicación privilegiada con acabados de primera calidad y diseño contemporáneo. Contáctanos para solicitar un dossier técnico completo o agendar una visita privada.'}
                </p>

                {((property.features && property.features.length > 0) || property.features === undefined) && (
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm pt-4">Características Destacadas:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 mt-2">
                      {(property.features && property.features.length > 0
                        ? property.features
                        : [
                            'Seguridad 24/7 y control de acceso',
                            'Excelente iluminación natural',
                            'Documentación inscrita en Registros Públicos',
                            'Cercano a avenidas principales y zonas comerciales',
                          ]
                      ).map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#c89b5c] shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Contact Card */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md sticky top-28 space-y-6">
                <h3 className="font-serif text-2xl font-normal text-slate-900 border-b border-slate-100 pb-3">
                  ¿Te interesa esta propiedad?
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  Contacta directamente a un agente especialista asignado para coordinar una visita presencial.
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={handleWhatsAppContact}
                    className="w-full justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-6"
                  >
                    <Phone className="w-4 h-4" /> Contactar por WhatsApp
                  </Button>

                  <Link href={`/contacto?property=${encodeURIComponent(property.title)}`}>
                    <Button
                      variant="outline"
                      className="w-full justify-center border-slate-800 text-slate-900 hover:border-[#c89b5c] hover:text-[#c89b5c] py-6 gap-2"
                    >
                      <Mail className="w-4 h-4" /> Enviar Mensaje
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── FULLSCREEN LIGHTBOX CAROUSEL MODAL ───────────────────────── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}
        >
          {/* Top Bar */}
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[#c89b5c] font-semibold">ARTEVÍA</span>
              <span className="text-slate-400 text-sm">|</span>
              <span className="text-xs text-slate-300 font-light hidden sm:inline">{property.title}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 bg-white/10 px-3 py-1 rounded-full">
                {currentIdx + 1} de {allImages.length}
              </span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Large Image in Lightbox */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            <div className="relative w-full h-full max-h-[75vh]">
              <Image
                src={allImages[currentIdx]}
                alt={`${property.title} - Vista Grande ${currentIdx + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Lightbox Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#c89b5c] text-white transition-all hover:scale-110 shadow-xl"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#c89b5c] text-white transition-all hover:scale-110 shadow-xl"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails in Lightbox */}
          {allImages.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto py-2 z-10">
              {allImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIdx(idx);
                  }}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    currentIdx === idx
                      ? 'border-[#c89b5c] scale-110 shadow-lg'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Miniatura modal ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </>
  );
}
