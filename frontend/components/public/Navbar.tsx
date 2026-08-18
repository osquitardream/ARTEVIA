'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, UserCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [initAuth]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md py-4 shadow-md border-b border-slate-200'
          : 'bg-white/90 backdrop-blur-sm py-5 border-b border-slate-100'
      }`}
    >
      <div className="container mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Official ARTEVIA Grupo Inmobiliario Logo */}
        <Link href="/" className="group flex items-center">
          <BrandLogo variant="dark" size="md" />
        </Link>

        {/* Desktop Navigation Links - Light Theme */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-700 hover:text-[#c89b5c] transition-colors">
            INICIO
          </Link>
          <Link href="/propiedades" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-700 hover:text-[#c89b5c] transition-colors">
            PROPIEDADES
          </Link>
          <Link href="/exitos" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-700 hover:text-[#c89b5c] transition-colors">
            ÉXITOS
          </Link>
          <Link href="/nosotros" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-700 hover:text-[#c89b5c] transition-colors">
            NOSOTROS
          </Link>
          <Link href="/contacto" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-700 hover:text-[#c89b5c] transition-colors">
            CONTACTO
          </Link>
        </nav>

        {/* Right side spacer / Admin indicator */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center">
            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.2em] font-medium px-4 py-2 border border-[#c89b5c] text-[#c89b5c] rounded-md hover:bg-[#c89b5c] hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <UserCircle className="w-4 h-4" />
              ADMIN
            </Link>
          </div>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-800 hover:text-[#c89b5c] focus:outline-none p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-8 py-8 space-y-6 animate-in slide-in-from-top duration-300 shadow-xl">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block text-xs uppercase tracking-[0.2em] text-slate-800 hover:text-[#c89b5c] font-medium py-2 border-b border-slate-100"
          >
            INICIO
          </Link>
          <Link
            href="/propiedades"
            onClick={() => setIsOpen(false)}
            className="block text-xs uppercase tracking-[0.2em] text-slate-800 hover:text-[#c89b5c] font-medium py-2 border-b border-slate-100"
          >
            PROPIEDADES
          </Link>
          <Link
            href="/exitos"
            onClick={() => setIsOpen(false)}
            className="block text-xs uppercase tracking-[0.2em] text-slate-800 hover:text-[#c89b5c] font-medium py-2 border-b border-slate-100"
          >
            ÉXITOS
          </Link>
          <Link
            href="/nosotros"
            onClick={() => setIsOpen(false)}
            className="block text-xs uppercase tracking-[0.2em] text-slate-800 hover:text-[#c89b5c] font-medium py-2 border-b border-slate-100"
          >
            NOSOTROS
          </Link>
          <Link
            href="/contacto"
            onClick={() => setIsOpen(false)}
            className="block text-xs uppercase tracking-[0.2em] text-slate-800 hover:text-[#c89b5c] font-medium py-2 border-b border-slate-100"
          >
            CONTACTO
          </Link>

          <div className="pt-4">
            <Link
              href={isAuthenticated ? '/admin' : '/intranet'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block text-center text-xs uppercase tracking-[0.25em] font-medium py-3 border border-slate-900 text-slate-900 rounded-md"
            >
              {isAuthenticated ? 'PANEL ADMIN' : 'INTRANET'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
