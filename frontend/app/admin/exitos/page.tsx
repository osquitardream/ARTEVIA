'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, RotateCcw } from 'lucide-react';
import { fetchApi, convertImageToBase64 } from '@/lib/api';

const storySchema = z.object({
  title: z.string().min(3, 'El título es obligatorio'),
  description: z.string().min(5, 'La descripción es obligatoria'),
  image: z.string().min(1, 'La imagen es obligatoria'),
  clientName: z.string().optional(),
});

type StoryFormData = z.infer<typeof storySchema>;

// ── Theme ──────────────────────────────────────────────────────────────────
const gold = '#c89b5c';
const bg = '#f9f6f1';
const white = '#ffffff';
const borderCol = '#e8e0d5';
const textMain = '#1a1410';
const textSub = '#6b5f52';
const textMuted = '#9b8b7a';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: `1px solid ${borderCol}`,
  borderRadius: 8,
  background: white,
  color: textMain,
  fontSize: 13,
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: textSub,
  marginBottom: 4,
};

export default function AdminExitosPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reactivatingId, setReactivatingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
  });

  const loadStories = async () => {
    try {
      const data = await fetchApi('/stories');
      setStories(data);
    } catch {
      toast.error('Error al cargar casos de éxito');
    }
  };

  useEffect(() => { loadStories(); }, []);

  const handleOpenCreate = () => {
    reset({ title: '', description: '', image: '', clientName: '' });
    setIsFormOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertImageToBase64(file);
      setValue('image', base64, { shouldValidate: true });
      toast.success('Imagen cargada desde tu dispositivo');
    } catch (err: any) {
      toast.error(err.message || 'Error al cargar imagen');
    } finally {
      e.target.value = '';
    }
  };

  const onSubmit = async (data: StoryFormData) => {
    try {
      await fetchApi('/stories', { method: 'POST', body: JSON.stringify(data) });
      toast.success('Caso de éxito publicado');
      setIsFormOpen(false);
      loadStories();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar caso de éxito?')) return;
    try {
      await fetchApi(`/stories/${id}`, { method: 'DELETE' });
      toast.success('Caso de éxito eliminado');
      loadStories();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar');
    }
  };

  const handleReactivar = async (story: any) => {
    if (!story.propertyId) {
      toast.error('Este caso de éxito no tiene una propiedad vinculada. Usa "Eliminar" directamente.');
      return;
    }
    if (!confirm(`¿Reactivar "${story.title}" en el catálogo de Propiedades?`)) return;
    setReactivatingId(story.id);
    try {
      await fetchApi(`/stories/${story.id}/reactivar`, { method: 'PATCH' });
      toast.success('¡Propiedad reactivada y disponible nuevamente en el catálogo!');
      loadStories();
    } catch (err: any) {
      toast.error(err.message || 'Error al reactivar');
    } finally {
      setReactivatingId(null);
    }
  };

  return (
    <div style={{ color: textMain }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: gold, marginBottom: 4 }}>
          HISTORIAL
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: textMain }}>
            Casos de Éxito
          </h1>
          <button
            onClick={handleOpenCreate}
            style={{ background: gold, color: white, border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Plus style={{ width: 16, height: 16 }} />
            Nuevo Caso de Éxito
          </button>
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {stories.length === 0 ? (
          <div style={{ gridColumn: '1/-1', padding: 48, textAlign: 'center', color: textMuted, background: white, borderRadius: 12, border: `1px solid ${borderCol}` }}>
            No hay casos de éxito registrados todavía.
          </div>
        ) : (
          stories.map((story) => (
            <div
              key={story.id}
              style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: 160, width: '100%' }}>
                <Image src={story.image} alt={story.title} fill style={{ objectFit: 'cover' }} />
                {/* Badge: vinculado a propiedad */}
                {story.propertyId && (
                  <span style={{
                    position: 'absolute', top: 10, left: 10,
                    background: 'rgba(200,155,92,0.9)',
                    color: white,
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 20,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    PROPIEDAD VINCULADA
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 400, color: textMain, margin: 0 }}>{story.title}</h3>
                <p style={{ fontSize: 12, color: textSub, lineHeight: 1.5, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {story.description}
                </p>
                {story.clientName && (
                  <p style={{ fontSize: 11, color: gold, fontWeight: 600, margin: 0 }}>
                    Cliente: {story.clientName}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div style={{ padding: '10px 16px', borderTop: `1px solid ${borderCol}`, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                {/* Reactivar button — only if linked to a property */}
                {story.propertyId && (
                  <button
                    onClick={() => handleReactivar(story)}
                    disabled={reactivatingId === story.id}
                    title="Recargar a Propiedades"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px',
                      borderRadius: 7,
                      border: `1px solid ${gold}`,
                      background: '#f5ede0',
                      color: gold,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: reactivatingId === story.id ? 'wait' : 'pointer',
                    }}
                  >
                    <RotateCcw style={{ width: 13, height: 13 }} />
                    {reactivatingId === story.id ? 'Reactivando...' : 'Recargar a Propiedades'}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(story.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7, border: `1px solid #fca5a5`, background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  <Trash2 style={{ width: 13, height: 13 }} />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── FORM MODAL ─────────────────────────────────────────────────── */}
      {isFormOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsFormOpen(false); }}
        >
          <div style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 16, padding: 32, width: '100%', maxWidth: 440 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: textMain, marginBottom: 24 }}>
              Nuevo Caso de Éxito
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Título del Hito *</label>
                <input {...register('title')} style={inputStyle} />
                {errors.title && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{errors.title.message}</p>}
              </div>

              <div>
                <label style={labelStyle}>Imagen (URL o Upload) *</label>
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
                <label style={labelStyle}>Nombre del Cliente / Empresa</label>
                <input {...register('clientName')} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Descripción *</label>
                <textarea rows={4} {...register('description')} style={{ ...inputStyle, resize: 'vertical' }} />
                {errors.description && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{errors.description.message}</p>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '9px 20px', borderRadius: 8, border: `1px solid ${borderCol}`, background: white, color: textSub, fontSize: 13, cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: gold, color: white, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
