'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Mail, Phone, Calendar, Trash2, CheckCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

const gold = '#c89b5c';
const white = '#ffffff';
const borderCol = '#e8e0d5';
const textMain = '#1a1410';
const textSub = '#6b5f52';
const textMuted = '#9b8b7a';

export default function AdminContactosPage() {
  const [contacts, setContacts] = useState<any[]>([]);

  const loadContacts = async () => {
    try {
      const data = await fetchApi('/contacts');
      setContacts(data);
    } catch {
      toast.error('Error al cargar mensajes de contacto');
    }
  };

  useEffect(() => { loadContacts(); }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetchApi(`/contacts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
      toast.success(`Estado actualizado a ${newStatus}`);
      loadContacts();
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar mensaje de contacto?')) return;
    try {
      await fetchApi(`/contacts/${id}`, { method: 'DELETE' });
      toast.success('Mensaje eliminado');
      loadContacts();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar');
    }
  };

  const statusColor = (s: string) => {
    if (s === 'ATENDIDO') return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' };
    if (s === 'LEIDO') return { bg: '#fff8e1', color: '#f57f17', border: '#ffe082' };
    return { bg: '#f5ede0', color: gold, border: '#e8c990' };
  };

  return (
    <div style={{ color: textMain }}>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: gold, marginBottom: 4 }}>
          BANDEJA DE ENTRADA
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: textMain }}>
          Leads y Contactos
        </h1>
        <p style={{ fontSize: 12, color: textMuted, marginTop: 4 }}>Mensajes enviados por potenciales clientes desde la web pública</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {contacts.length === 0 ? (
          <div style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 12, padding: 48, textAlign: 'center', color: textMuted }}>
            No hay mensajes registrados en la bandeja.
          </div>
        ) : (
          contacts.map((c) => {
            const sc = statusColor(c.status);
            return (
              <div key={c.id} style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid ${borderCol}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 400, color: textMain, margin: 0 }}>{c.name}</h3>
                    <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 20, letterSpacing: '0.06em' }}>
                      {c.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: textMuted }}>
                    <Calendar style={{ width: 13, height: 13 }} />
                    {new Date(c.createdAt).toLocaleString('es-PE')}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: textSub }}>
                    <Mail style={{ width: 14, height: 14, color: gold }} />
                    <a href={`mailto:${c.email}`} style={{ color: textSub, textDecoration: 'none' }}>{c.email}</a>
                  </div>
                  {c.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: textSub }}>
                      <Phone style={{ width: 14, height: 14, color: gold }} />
                      <a href={`tel:${c.phone}`} style={{ color: textSub, textDecoration: 'none' }}>{c.phone}</a>
                    </div>
                  )}
                </div>

                {c.subject && (
                  <p style={{ fontSize: 12, fontWeight: 700, color: gold, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Asunto: {c.subject}
                  </p>
                )}

                <div style={{ background: '#faf7f3', padding: 14, borderRadius: 8, border: `1px solid ${borderCol}`, fontSize: 13, color: textMain, lineHeight: 1.6, marginBottom: 16 }}>
                  {c.message}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  {c.status !== 'ATENDIDO' && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, 'ATENDIDO')}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 7, border: '1px solid #a5d6a7', background: '#e8f5e9', color: '#2e7d32', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      <CheckCircle style={{ width: 13, height: 13 }} /> Marcar Atendido
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7, border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    <Trash2 style={{ width: 13, height: 13 }} /> Eliminar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
