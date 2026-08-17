'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  LayoutDashboard,
  MapPin,
  Users,
  MessageSquare,
  Award,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { BrandLogo } from '@/components/ui/BrandLogo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, initAuth, logout } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    const token = localStorage.getItem('artevia_token');
    if (!token) {
      router.push('/intranet');
    }
  }, [isAuthenticated, router]);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Propiedades', href: '/admin/propiedades', icon: Building2 },
    { name: 'Éxitos', href: '/admin/exitos', icon: Award },
    { name: 'Distritos', href: '/admin/distritos', icon: MapPin },
    { name: 'Representantes', href: '/admin/representantes', icon: Users },
    { name: 'Contactos', href: '/admin/contactos', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#f9f6f1', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside
        className="w-44 hidden md:flex flex-col justify-between border-r"
        style={{ background: '#fff', borderColor: '#e8e0d5' }}
      >
        {/* Logo */}
        <div>
          <Link href="/" className="flex flex-col items-center px-4 pt-6 pb-4 border-b border-[#e8e0d5]">
            <BrandLogo variant="dark" size="sm" />
            <span
              className="text-[8px] tracking-[0.25em] uppercase font-bold mt-2"
              style={{ color: '#c89b5c' }}
            >
              PANEL INTERNO
            </span>
          </Link>

          {/* Nav */}
          <nav className="px-3 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={
                    active
                      ? {
                          background: '#c89b5c',
                          color: '#fff',
                          fontWeight: 600,
                        }
                      : {
                          color: '#6b5f52',
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background = '#f5ede0';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#1a1410';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#6b5f52';
                    }
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Logout */}
        <div className="px-3 pb-6 pt-4 border-t" style={{ borderColor: '#e8e0d5' }}>
          <button
            onClick={() => {
              logout();
              router.push('/intranet');
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-all"
            style={{ color: '#6b5f52' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2';
              (e.currentTarget as HTMLButtonElement).style.color = '#dc2626';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = '#6b5f52';
            }}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header
          className="h-12 flex items-center justify-end px-8 border-b text-xs"
          style={{ background: '#fff', borderColor: '#e8e0d5', color: '#9b8b7a' }}
        >
          {user?.email || 'administracion@arteviainmobiliaria.com'}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8" style={{ background: '#f9f6f1' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
