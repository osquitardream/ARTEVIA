import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-8 pb-5 sm:pt-10 sm:pb-6">
      <div className="container mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
        {/* Brand Col */}
        <div className="space-y-2.5">
          <Link href="/" className="group inline-block">
            <BrandLogo variant="light" size="md" />
          </Link>
          <p className="text-xs leading-relaxed text-slate-400 font-light max-w-xs">
            Propiedades exclusivas en las zonas más codiciadas de Cajamarca. Experiencia, discreción y resultados.
          </p>
          <div className="flex items-center gap-2.5 pt-1">
            <a href="#" className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#c89b5c] text-slate-400 hover:text-white transition-colors">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#c89b5c] text-slate-400 hover:text-white transition-colors">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#c89b5c] text-slate-400 hover:text-white transition-colors">
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-sm text-white mb-2.5 border-b border-[#c89b5c]/30 pb-1.5 inline-block font-normal">Navegación</h4>
          <ul className="space-y-1.5 text-xs font-light">
            <li><Link href="/" className="hover:text-[#c89b5c] transition-colors">Inicio</Link></li>
            <li><Link href="/propiedades" className="hover:text-[#c89b5c] transition-colors">Catálogo de Propiedades</Link></li>
            <li><Link href="/nosotros" className="hover:text-[#c89b5c] transition-colors">Acerca de Nosotros</Link></li>
            <li><Link href="/exitos" className="hover:text-[#c89b5c] transition-colors">Casos de Éxito</Link></li>
            <li><Link href="/contacto" className="hover:text-[#c89b5c] transition-colors">Contacto</Link></li>
            <li>
              <Link
                href="/intranet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#c89b5c] transition-colors inline-flex items-center gap-1"
              >
                <span>&bull;</span> Intranet Corporativa
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-serif text-sm text-white mb-2.5 border-b border-[#c89b5c]/30 pb-1.5 inline-block font-normal">Categorías</h4>
          <ul className="space-y-1.5 text-xs font-light">
            <li><Link href="/propiedades?type=casa" className="hover:text-[#c89b5c] transition-colors">Residencias de Lujo</Link></li>
            <li><Link href="/propiedades?type=departamento" className="hover:text-[#c89b5c] transition-colors">Departamentos Exclusivos</Link></li>
            <li><Link href="/propiedades?type=oficina" className="hover:text-[#c89b5c] transition-colors">Oficinas Corporativas</Link></li>
            <li><Link href="/propiedades?type=terreno" className="hover:text-[#c89b5c] transition-colors">Terrenos e Inversiones</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-serif text-sm text-white mb-2.5 border-b border-[#c89b5c]/30 pb-1.5 inline-block font-normal">Contacto</h4>
          <ul className="space-y-2 text-xs font-light">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-[#c89b5c] shrink-0 mt-0.5" />
              <span>Cajamarca, Perú (Atención Digital y Personalizada)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-[#c89b5c] shrink-0" />
              <a href="https://wa.me/51965355800" target="_blank" rel="noreferrer" className="hover:text-[#c89b5c] transition-colors">
                +51 965 355 800
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-[#c89b5c] shrink-0" />
              <a href="mailto:arteviainmobiliaria@gmail.com" className="hover:text-[#c89b5c] transition-colors">
                arteviainmobiliaria@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 sm:px-10 mt-6 pt-3.5 border-t border-slate-800 text-xs text-center text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2">
        <p>© {new Date().getFullYear()} ARTEVÍA Inmobiliaria. Todos los derechos reservados.</p>
        <div className="flex items-center gap-3">
          <Link
            href="/intranet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-[#c89b5c] transition-colors"
          >
            Acceso Intranet
          </Link>
          <span className="text-slate-700">&bull;</span>
          <p className="text-slate-600">Cajamarca, Perú</p>
        </div>
      </div>
    </footer>
  );
}
