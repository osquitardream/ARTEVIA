'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { fetchApi, convertImageToBase64 } from '@/lib/api';

const districtSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  image: z.string().min(1, 'La imagen es requerida'),
  description: z.string().optional(),
});

type DistrictFormData = z.infer<typeof districtSchema>;

const gold = '#c89b5c';
const white = '#ffffff';
const borderCol = '#e8e0d5';
const textMain = '#1a1410';
const textSub = '#6b5f52';
const textMuted = '#9b8b7a';
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: `1px solid ${borderCol}`, borderRadius: 8, background: white, color: textMain, fontSize: 13, outline: 'none' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textSub, marginBottom: 4 };

export default function AdminDistritosPage() {
  const [districts, setDistricts] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDist, setEditingDist] = useState<any | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<DistrictFormData>({
    resolver: zodResolver(districtSchema),
  });

  const loadDistricts = async () => {
    try {
      const data = await fetchApi('/districts');
      setDistricts(data);
    } catch { toast.error('Error al cargar distritos'); }
  };

  useEffect(() => { loadDistricts(); }, []);

  const handleOpenCreate = () => { setEditingDist(null); reset({ name: '', image: '', description: '' }); setIsFormOpen(true); };
  const handleOpenEdit = (dist: any) => { setEditingDist(dist); reset({ name: dist.name, image: dist.image, description: dist.description || '' }); setIsFormOpen(true); };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertImageToBase64(file);
      setValue('image', base64, { shouldValidate: true });
      toast.success('Imagen cargada');
    } catch (err: any) { toast.error(err.message); } finally { e.target.value = ''; }
  };

  const onSubmit = async (data: DistrictFormData) => {
    try {
      if (editingDist) {
        await fetchApi(`/districts/${editingDist.id}`, { method: 'PUT', body: JSON.stringify(data) });
        toast.success('Distrito actualizado');
      } else {
        await fetchApi('/districts', { method: 'POST', body: JSON.stringify(data) });
        toast.success('Distrito creado');
      }
      setIsFormOpen(false);
      loadDistricts();
    } catch (err: any) { toast.error(err.message || 'Error al guardar'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este distrito?')) return;
    try {
      await fetchApi(`/districts/${id}`, { method: 'DELETE' });
      toast.success('Distrito eliminado');
      loadDistricts();
    } catch (err: any) { toast.error(err.message || 'Error al eliminar'); }
  };

  return (
    <div style={{ color: textMain }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: gold, marginBottom: 4 }}>GESTIÓN</p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: textMain }}>Distritos</h1>
          <button onClick={handleOpenCreate} style={{ background: gold, color: white, border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 16, height: 16 }} /> Nuevo Distrito
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
        {districts.map((dist) => (
          <div key={dist.id} style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 140, width: '100%' }}>
              <Image src={dist.image} alt={dist.name} fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 400, color: textMain, margin: 0 }}>{dist.name}</h3>
                <p style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{dist._count?.properties || 0} inmuebles</p>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => handleOpenEdit(dist)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 7, color: gold }} onMouseEnter={(e) => (e.currentTarget.style.background = '#f5ede0')} onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>
                  <Edit style={{ width: 15, height: 15 }} />
                </button>
                <button onClick={() => handleDelete(dist.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 7, color: '#dc2626' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')} onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>
                  <Trash2 style={{ width: 15, height: 15 }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={(e) => { if (e.target === e.currentTarget) setIsFormOpen(false); }}>
          <div style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 16, padding: 32, width: '100%', maxWidth: 420 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: textMain, marginBottom: 24 }}>{editingDist ? 'Editar Distrito' : 'Nuevo Distrito'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Nombre del Distrito</label>
                <input {...register('name')} style={inputStyle} />
                {errors.name && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{errors.name.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Imagen (URL o Upload)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input {...register('image')} placeholder="https://..." style={{ ...inputStyle, flex: 1 }} />
                  <label style={{ cursor: 'pointer', background: gold, color: white, padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Upload style={{ width: 14, height: 14 }} />
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {errors.image && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{errors.image.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Descripción</label>
                <textarea rows={3} {...register('description')} style={{ ...inputStyle, resize: 'vertical' }} />
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
