'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, MapPin, Users, MessageSquare, ArrowUpRight, Plus } from 'lucide-react';
import { fetchApi } from '@/lib/api';

const gold = '#c89b5c';
const white = '#ffffff';
const borderCol = '#e8e0d5';
const textMain = '#1a1410';
const textSub = '#6b5f52';
const textMuted = '#9b8b7a';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({ propertiesCount: 0, districtsCount: 0, repsCount: 0, contactsCount: 0 });
  const [recentProperties, setRecentProperties] = useState<any[]>([]);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const props = await fetchApi('/properties');
        const dists = await fetchApi('/districts');
        const reps = await fetchApi('/reps');
        const contacts = await fetchApi('/contacts');
        setMetrics({ propertiesCount: props.length, districtsCount: dists.length, repsCount: reps.length, contactsCount: contacts.length });
        setRecentProperties(props.slice(0, 5));
      } catch (err) {
        console.error('Error loading admin metrics:', err);
      }
    }
    loadMetrics();
  }, []);

  const cards = [
    { label: 'Propiedades', value: metrics.propertiesCount, sub: 'Inmuebles registrados', icon: Building2, href: '/admin/propiedades' },
    { label: 'Distritos Activos', value: metrics.districtsCount, sub: 'Zonas con oferta', icon: MapPin, href: '/admin/distritos' },
    { label: 'Equipo de Agentes', value: metrics.repsCount, sub: 'Representantes comerciales', icon: Users, href: '/admin/representantes' },
    { label: 'Leads Recibidos', value: metrics.contactsCount, sub: 'Mensajes de clientes', icon: MessageSquare, href: '/admin/contactos' },
  ];

  return (
    <div style={{ color: textMain }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: gold, marginBottom: 4 }}>
          PANEL PRINCIPAL
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: textMain }}>
          Dashboard
        </h1>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 12, padding: '20px 20px', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(200,155,92,0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: textMuted, margin: 0 }}>{c.label}</p>
                  <Icon style={{ width: 18, height: 18, color: gold }} />
                </div>
                <p style={{ fontSize: 32, fontWeight: 800, color: textMain, margin: 0, lineHeight: 1 }}>{c.value}</p>
                <p style={{ fontSize: 11, color: textMuted, marginTop: 6 }}>{c.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 12, padding: '20px 24px', marginBottom: 28, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 400, color: textMain, margin: 0 }}>Acciones Rápidas</h3>
          <p style={{ fontSize: 12, color: textMuted, marginTop: 4 }}>Gestión de catálogo, publicación de propiedades e inspección de leads.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/admin/propiedades">
            <button style={{ padding: '9px 20px', borderRadius: 7, border: 'none', background: gold, color: white, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus style={{ width: 14, height: 14 }} /> Agregar Propiedad
            </button>
          </Link>
          <Link href="/admin/contactos">
            <button style={{ padding: '9px 20px', borderRadius: 7, border: `1px solid ${borderCol}`, background: white, color: textSub, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Ver Bandeja de Leads
            </button>
          </Link>
        </div>
      </div>

      {/* Recent Properties */}
      <div style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${borderCol}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 400, color: textMain, margin: 0 }}>Propiedades Recientes</h3>
            <p style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>Últimos inmuebles ingresados al sistema</p>
          </div>
          <Link href="/admin/propiedades" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: gold, textDecoration: 'none', fontWeight: 600 }}>
            Ver Todas <ArrowUpRight style={{ width: 13, height: 13 }} />
          </Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#faf7f3' }}>
              {['Título', 'Ubicación', 'Operación', 'Precio'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentProperties.map((prop, idx) => (
              <tr key={prop.id} style={{ borderTop: `1px solid ${borderCol}` }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: textMain }}>{prop.title}</td>
                <td style={{ padding: '12px 16px', color: textSub }}>{prop.location}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: prop.operation === 'VENTA' ? '#f5ede0' : '#e8f5e9', color: prop.operation === 'VENTA' ? gold : '#2e7d32', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                    {prop.operation}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: textMain }}>
                  S/. {Number(prop.price).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
