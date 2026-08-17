'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { fetchApi, convertImageToBase64 } from '@/lib/api';

const repSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  role: z.string().min(2, 'El cargo es obligatorio'),
  image: z.string().min(1, 'La imagen es obligatoria'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
});

type RepFormData = z.infer<typeof repSchema>;

const gold = '#c89b5c';
const white = '#ffffff';
const borderCol = '#e8e0d5';
const textMain = '#1a1410';
const textSub = '#6b5f52';
const textMuted = '#9b8b7a';
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: `1px solid ${borderCol}`, borderRadius: 8, background: white, color: textMain, fontSize: 13, outline: 'none' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textSub, marginBottom: 4 };

export default function AdminRepresentantesPage() {
  const [reps, setReps] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRep, setEditingRep] = useState<any | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<RepFormData>({
    resolver: zodResolver(repSchema),
  });

  const loadReps = async () => {
    try {
      const data = await fetchApi('/reps');
      setReps(data);
    } catch { toast.error('Error al cargar representantes'); }
  };

  useEffect(() => { loadReps(); }, []);

  const handleOpenCreate = () => { setEditingRep(null); reset({ name: '', role: '', image: '', email: '', phone: '' }); setIsFormOpen(true); };
  const handleOpenEdit = (rep: any) => { setEditingRep(rep); reset({ name: rep.name, role: rep.role, image: rep.image, email: rep.email || '', phone: rep.phone || '' }); setIsFormOpen(true); };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertImageToBase64(file);
      setValue('image', base64, { shouldValidate: true });
      toast.success('Foto cargada');
    } catch (err: any) { toast.error(err.message); } finally { e.target.value = ''; }
  };

  const onSubmit = async (data: RepFormData) => {
    try {
      if (editingRep) {
        await fetchApi(`/reps/${editingRep.id}`, { method: 'PUT', body: JSON.stringify(data) });
        toast.success('Representante actualizado');
      } else {
        await fetchApi('/reps', { method: 'POST', body: JSON.stringify(data) });
        toast.success('Representante registrado');
      }
      setIsFormOpen(false);
      loadReps();
    } catch (err: any) { toast.error(err.message || 'Error al guardar'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar representante?')) return;
    try {
      await fetchApi(`/reps/${id}`, { method: 'DELETE' });
      toast.success('Representante eliminado');
      loadReps();
    } catch (err: any) { toast.error(err.message || 'Error al eliminar'); }
  };

  return (
    <div style={{ color: textMain }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: gold, marginBottom: 4 }}>EQUIPO</p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: textMain }}>Representantes</h1>
          <button onClick={handleOpenCreate} style={{ background: gold, color: white, border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 16, height: 16 }} /> Nuevo Representante
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
        {reps.map((rep) => (
          <div key={rep.id} style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 12, padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: `2px solid ${borderCol}` }}>
              <Image src={rep.image} alt={rep.name} fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 400, color: textMain, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rep.name}</h3>
              <p style={{ fontSize: 11, fontWeight: 700, color: gold, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{rep.role}</p>
              <p style={{ fontSize: 11, color: textMuted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rep.email || rep.phone}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
              <button onClick={() => handleOpenEdit(rep)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 7, color: gold }} onMouseEnter={(e) => (e.currentTarget.style.background = '#f5ede0')} onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>
                <Edit style={{ width: 15, height: 15 }} />
              </button>
              <button onClick={() => handleDelete(rep.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 7, color: '#dc2626' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')} onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>
                <Trash2 style={{ width: 15, height: 15 }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={(e) => { if (e.target === e.currentTarget) setIsFormOpen(false); }}>
          <div style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 16, padding: 32, width: '100%', maxWidth: 440 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: textMain, marginBottom: 24 }}>{editingRep ? 'Editar Representante' : 'Nuevo Representante'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Nombre Completo *</label>
                <input {...register('name')} style={inputStyle} />
                {errors.name && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{errors.name.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Cargo / Rol *</label>
                <input {...register('role')} placeholder="Ej: AGENTE SENIOR" style={inputStyle} />
                {errors.role && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{errors.role.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Fotografía (URL o Upload) *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input {...register('image')} placeholder="https://..." style={{ ...inputStyle, flex: 1 }} />
                  <label style={{ cursor: 'pointer', background: gold, color: white, padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Upload style={{ width: 14, height: 14 }} />
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {errors.image && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{errors.image.message}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Correo Electrónico</label>
                  <input {...register('email')} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input {...register('phone')} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '9px 20px', borderRadius: 8, border: `1px solid ${borderCol}`, background: white, color: textSub, fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: gold, color: white, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
