'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload, Search, CheckCircle2, Tag, Star, ImageIcon, X } from 'lucide-react';
import { fetchApi, convertMultipleImagesToBase64 } from '@/lib/api';

const FEATURE_SUGGESTIONS = [
  'Seguridad 24/7 y control de acceso',
  'Excelente iluminación natural',
  'Documentación inscrita en Registros Públicos',
  'Cercano a avenidas principales y zonas comerciales',
  'Áreas verdes y jardines',
  'Piscina y zona de terraza',
  'Estacionamiento techado',
  'Acabados de primera calidad',
  'Ascensor directo',
  'Pet friendly',
  'Zona de BBQ / Parrillas',
  'Vista panorámica',
];

const propertyFormSchema = z.object({
  title: z.string().min(3, 'El título es obligatorio'),
  location: z.string().min(2, 'La ubicación es obligatoria'),
  price: z.coerce.number().positive('El precio debe ser un número positivo'),
  operation: z.enum(['VENTA', 'ALQUILER']),
  type: z.enum(['CASA', 'DEPARTAMENTO', 'OFICINA', 'TERRENO', 'LOCAL_COMERCIAL']),
  area: z.coerce.number().positive('El área debe ser positiva'),
  beds: z.coerce.number().min(0),
  baths: z.coerce.number().min(0),
  featured: z.boolean().default(false),
  description: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

// ── Styles (inline for the light-beige theme) ──────────────────────────────
const gold = '#c89b5c';
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

export default function AdminPropiedadesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProps, setFilteredProps] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<any | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Gallery images list for create/edit
  const [imageList, setImageList] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');

  // Features list state
  const [featureList, setFeatureList] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');

  // "Marcar vendido" modal state
  const [markModal, setMarkModal] = useState<{ prop: any; open: boolean }>({ prop: null, open: false });
  const [markStatus, setMarkStatus] = useState<'VENDIDO' | 'ALQUILADO'>('VENDIDO');
  const [markClient, setMarkClient] = useState('');
  const [markDesc, setMarkDesc] = useState('');
  const [markLoading, setMarkLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: { operation: 'VENTA', type: 'CASA', beds: 3, baths: 2, featured: false },
  });

  const loadProperties = async () => {
    try {
      const data = await fetchApi('/properties');
      setProperties(data);
      setFilteredProps(data);
    } catch {
      toast.error('Error al cargar propiedades');
    }
  };

  useEffect(() => { loadProperties(); }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredProps(properties);
    } else {
      setFilteredProps(
        properties.filter(
          (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.location.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, properties]);

  const handleOpenCreate = () => {
    setEditingProp(null);
    setImageList([]);
    setUrlInput('');
    setFeatureList([
      'Seguridad 24/7 y control de acceso',
      'Excelente iluminación natural',
      'Documentación inscrita en Registros Públicos',
      'Cercano a avenidas principales y zonas comerciales',
    ]);
    setFeatureInput('');
    reset({ title: '', location: '', price: 0, operation: 'VENTA', type: 'CASA', area: 100, beds: 2, baths: 2, featured: false, description: '' });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prop: any) => {
    setEditingProp(prop);
    const existingImages = prop.images && prop.images.length > 0
      ? prop.images
      : (prop.image ? [prop.image] : []);
    setImageList(existingImages);
    setUrlInput('');
    const existingFeatures = Array.isArray(prop.features) && prop.features.length > 0
      ? prop.features
      : [];
    setFeatureList(existingFeatures);
    setFeatureInput('');
    reset({
      title: prop.title,
      location: prop.location,
      price: Number(prop.price),
      operation: prop.operation,
      type: prop.type,
      area: prop.area,
      beds: prop.beds,
      baths: prop.baths,
      featured: prop.featured || false,
      description: prop.description || ''
    });
    setIsFormOpen(true);
  };

  const handleAddFeature = (text?: string) => {
    const val = (text !== undefined ? text : featureInput).trim();
    if (!val) return;
    if (featureList.includes(val)) {
      toast.info('Esta característica ya está agregada');
      return;
    }
    setFeatureList((prev) => [...prev, val]);
    if (text === undefined) setFeatureInput('');
  };

  const handleRemoveFeature = (indexToRemove: number) => {
    setFeatureList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleToggleSuggestion = (sug: string) => {
    if (featureList.includes(sug)) {
      setFeatureList((prev) => prev.filter((f) => f !== sug));
    } else {
      setFeatureList((prev) => [...prev, sug]);
    }
  };

  // Upload multiple images from file picker
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      const base64List = await convertMultipleImagesToBase64(files);
      setImageList((prev) => [...prev, ...base64List]);
      toast.success(`${base64List.length} ${base64List.length === 1 ? 'imagen subida' : 'imágenes subidas'} con éxito`);
    } catch (err: any) {
      toast.error(err.message || 'Error al cargar las imágenes');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Add image via URL
  const handleAddUrlImage = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      toast.error('Por favor ingresa una URL válida (http:// o https://)');
      return;
    }
    setImageList((prev) => [...prev, trimmed]);
    setUrlInput('');
    toast.success('Imagen agregada a la lista');
  };

  // Remove single image from list
  const handleRemoveImage = (indexToRemove: number) => {
    setImageList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Make an image the primary one (move to index 0)
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    setImageList((prev) => {
      const selected = prev[index];
      const without = prev.filter((_, idx) => idx !== index);
      return [selected, ...without];
    });
    toast.success('Imagen establecida como principal');
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (imageList.length === 0) {
      toast.error('Debes subir o agregar al menos 1 imagen para la propiedad.');
      return;
    }

    const payload = {
      ...data,
      image: imageList[0],
      images: imageList,
      features: featureList,
    };

    try {
      if (editingProp) {
        await fetchApi(`/properties/${editingProp.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast.success('Propiedad actualizada');
      } else {
        await fetchApi('/properties', { method: 'POST', body: JSON.stringify(payload) });
        toast.success('Propiedad creada exitosamente');
      }
      setIsFormOpen(false);
      loadProperties();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar la propiedad');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;
    try {
      await fetchApi(`/properties/${id}`, { method: 'DELETE' });
      toast.success('Propiedad eliminada');
      loadProperties();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar');
    }
  };

  const openMarkModal = (prop: any) => {
    setMarkModal({ prop, open: true });
    setMarkStatus(prop.operation === 'ALQUILER' ? 'ALQUILADO' : 'VENDIDO');
    setMarkClient('');
    setMarkDesc('');
  };

  const handleConfirmMark = async () => {
    if (!markModal.prop) return;
    setMarkLoading(true);
    try {
      await fetchApi(`/properties/${markModal.prop.id}/marcar-vendido`, {
        method: 'PATCH',
        body: JSON.stringify({
          newStatus: markStatus,
          clientName: markClient || undefined,
          storyDescription: markDesc || undefined,
        }),
      });
      toast.success(`¡Propiedad marcada como ${markStatus === 'VENDIDO' ? 'Vendida' : 'Alquilada'} y añadida a Casos de Éxito!`);
      setMarkModal({ prop: null, open: false });
      loadProperties();
    } catch (err: any) {
      toast.error(err.message || 'Error al marcar');
    } finally {
      setMarkLoading(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === 'VENDIDO') return '#16a34a';
    if (status === 'ALQUILADO') return '#2563eb';
    if (status === 'RESERVADO') return '#d97706';
    return '#16a34a'; // DISPONIBLE
  };

  const statusLabel = (status: string) => {
    if (status === 'VENDIDO') return 'VENDIDO';
    if (status === 'ALQUILADO') return 'ALQUILADO';
    if (status === 'RESERVADO') return 'RESERVADO';
    return 'ACTIVO';
  };

  return (
    <div style={{ color: textMain }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: gold, marginBottom: 4 }}>
          LISTADO COMPLETO
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 style={{ fontSize: 28, fontFamily: 'Georgia, serif', fontWeight: 400, color: textMain }}>
            Mantenimiento de Propiedades
          </h1>
          <button
            onClick={handleOpenCreate}
            style={{ background: gold, color: white, border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em' }}
          >
            + NUEVO (BORRADOR RÁPIDO)
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 320, marginBottom: 20 }}>
        <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: textMuted }} />
        <input
          placeholder="Buscar propiedad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft: 32 }}
        />
      </div>

      {/* Properties list */}
      <div style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 12, overflow: 'hidden' }}>
        {filteredProps.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: textMuted }}>
            No hay propiedades registradas.
          </div>
        ) : (
          filteredProps.map((prop, idx) => {
            const countImages = (prop.images && prop.images.length > 0) ? prop.images.length : (prop.image ? 1 : 0);
            return (
              <div
                key={prop.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 20px',
                  borderBottom: idx < filteredProps.length - 1 ? `1px solid ${borderCol}` : 'none',
                  flexWrap: 'wrap',
                }}
              >
                {/* Image & count badge */}
                <div style={{ width: 72, height: 54, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  <Image
                    src={prop.image || (prop.images?.[0]) || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200'}
                    alt={prop.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {countImages > 1 && (
                    <span style={{
                      position: 'absolute', bottom: 3, right: 3,
                      background: 'rgba(0,0,0,0.7)',
                      color: white,
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <ImageIcon style={{ width: 9, height: 9 }} /> {countImages}
                    </span>
                  )}
                </div>

                {/* Title + location + badge */}
                <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: textMain, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {prop.title}
                  </p>
                  <p style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>
                    📍 {prop.location}
                  </p>
                  {prop.featured && (
                    <span style={{ display: 'inline-block', marginTop: 4, background: '#f5ede0', color: gold, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, letterSpacing: '0.06em' }}>
                      ★ DESTACADO
                    </span>
                  )}
                </div>

                {/* Type + operation */}
                <div style={{ flexShrink: 0, width: 110 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: textMain, textTransform: 'uppercase' }}>{prop.type}</p>
                  <p style={{ fontSize: 11, color: textMuted, textTransform: 'uppercase' }}>{prop.operation}</p>
                </div>

                {/* Price */}
                <div style={{ flexShrink: 0, width: 110 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: textMain }}>
                    S/. {Number(prop.price).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Status badge */}
                <div style={{ flexShrink: 0 }}>
                  <span style={{
                    display: 'inline-block',
                    background: `${statusColor(prop.status)}15`,
                    color: statusColor(prop.status),
                    border: `1px solid ${statusColor(prop.status)}40`,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 20,
                    letterSpacing: '0.06em',
                  }}>
                    {statusLabel(prop.status)}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  {/* Marcar Vendido/Alquilado — only if DISPONIBLE or RESERVADO */}
                  {(prop.status === 'DISPONIBLE' || prop.status === 'RESERVADO') && (
                    <button
                      title="Marcar Vendido/Alquilado"
                      onClick={() => openMarkModal(prop)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: gold, display: 'flex', alignItems: 'center' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f5ede0')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <Tag style={{ width: 16, height: 16 }} />
                    </button>
                  )}
                  <button
                    title="Editar"
                    onClick={() => handleOpenEdit(prop)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: textSub, display: 'flex', alignItems: 'center' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Edit style={{ width: 16, height: 16 }} />
                  </button>
                  <button
                    title="Eliminar"
                    onClick={() => handleDelete(prop.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#dc2626', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Trash2 style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── CRUD FORM MODAL (with Multi-image Gallery upload) ───────────── */}
      {isFormOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsFormOpen(false); }}
        >
          <div style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 16, padding: 32, width: '100%', maxWidth: 680, maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: textMain, margin: 0 }}>
                {editingProp ? 'Editar Propiedad' : 'Nueva Propiedad'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, padding: 4 }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Título de la Propiedad *</label>
                <input {...register('title')} placeholder="Ej: Residencia Exclusiva en Baños del Inca" style={inputStyle} />
                {errors.title && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{errors.title.message}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Ubicación / Distrito *</label>
                  <input {...register('location')} placeholder="Ej: Baños del Inca, Cajamarca" style={inputStyle} />
                  {errors.location && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{errors.location.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Precio (S/.) *</label>
                  <input type="number" step="any" {...register('price')} style={inputStyle} />
                  {errors.price && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{errors.price.message}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Operación *</label>
                  <select {...register('operation')} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="VENTA">VENTA</option>
                    <option value="ALQUILER">ALQUILER</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tipo de Inmueble *</label>
                  <select {...register('type')} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="CASA">CASA</option>
                    <option value="DEPARTAMENTO">DEPARTAMENTO</option>
                    <option value="OFICINA">OFICINA</option>
                    <option value="TERRENO">TERRENO</option>
                    <option value="LOCAL_COMERCIAL">LOCAL COMERCIAL</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Área (m²)</label>
                  <input type="number" {...register('area')} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Dormitorios</label>
                  <input type="number" {...register('beds')} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Baños</label>
                  <input type="number" {...register('baths')} style={inputStyle} />
                </div>
              </div>

              {/* ── MULTI-IMAGE UPLOADER SECTION ────────────────────── */}
              <div style={{ background: '#faf7f3', border: `1px solid ${borderCol}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <label style={{ ...labelStyle, marginBottom: 2 }}>
                      Galería de Imágenes ({imageList.length} {imageList.length === 1 ? 'foto' : 'fotos'}) *
                    </label>
                    <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>
                      Sube 1 o varias imágenes. La primera foto será la carátula principal.
                    </p>
                  </div>

                  {/* Multiple file picker button */}
                  <label style={{
                    cursor: uploadingImage ? 'wait' : 'pointer',
                    background: uploadingImage ? '#d1c7bc' : gold,
                    color: white,
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(200,155,92,0.25)',
                    transition: 'all 0.15s'
                  }}>
                    <Upload style={{ width: 14, height: 14 }} />
                    {uploadingImage ? 'Procesando...' : '+ Subir Imágenes'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {/* Or add via URL input */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10, marginBottom: 12 }}>
                  <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrlImage(); } }}
                    placeholder="O pega una URL de imagen (https://...) y presiona Agregar"
                    style={{ ...inputStyle, flex: 1, fontSize: 12 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${borderCol}`, background: white, color: textSub, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Agregar URL
                  </button>
                </div>

                {/* Thumbnails grid */}
                {imageList.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', border: `2px dashed ${borderCol}`, borderRadius: 10, background: white, color: textMuted, fontSize: 12 }}>
                    No has agregado ninguna foto aún. Haz clic en <strong>+ Subir Fotos</strong> para seleccionar una o varias imágenes de tu computadora.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10, marginTop: 12 }}>
                    {imageList.map((img, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          height: 85,
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: idx === 0 ? `2px solid ${gold}` : `1px solid ${borderCol}`,
                          background: '#eee',
                          boxShadow: idx === 0 ? '0 2px 8px rgba(200,155,92,0.3)' : 'none'
                        }}
                      >
                        <Image src={img} alt={`Foto ${idx + 1}`} fill style={{ objectFit: 'cover' }} />

                        {/* Principal Badge */}
                        {idx === 0 && (
                          <span style={{
                            position: 'absolute', top: 4, left: 4,
                            background: gold, color: white,
                            fontSize: 8, fontWeight: 700,
                            padding: '2px 5px', borderRadius: 4,
                            textTransform: 'uppercase', letterSpacing: '0.04em'
                          }}>
                            Principal
                          </span>
                        )}

                        {/* Actions overlay */}
                        <div style={{
                          position: 'absolute', bottom: 0, insetInline: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                          padding: '4px 6px',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                          {idx !== 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(idx)}
                              title="Hacer foto principal"
                              style={{ background: 'none', border: 'none', color: '#fef08a', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
                            >
                              <Star style={{ width: 12, height: 12 }} />
                            </button>
                          ) : <div />}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Eliminar foto"
                            style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
                          >
                            <Trash2 style={{ width: 12, height: 12 }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Descripción</label>
                <textarea rows={3} {...register('description')} placeholder="Detalles atractivos sobre la propiedad..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* ── CARACTERÍSTICAS DESTACADAS SECTION ────────────────────── */}
              <div style={{ background: '#faf7f3', border: `1px solid ${borderCol}`, borderRadius: 12, padding: 16 }}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ ...labelStyle, marginBottom: 2 }}>
                    Características Destacadas ({featureList.length})
                  </label>
                  <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>
                    Puntos clave y ventajas que aparecerán con ícono de check en la ficha del inmueble.
                  </p>
                </div>

                {/* Custom feature input */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Escribe una característica personalizada y presiona Enter..."
                    style={{ ...inputStyle, flex: 1, fontSize: 12 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFeature()}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: gold,
                      color: white,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Plus style={{ width: 14, height: 14 }} /> Agregar
                  </button>
                </div>

                {/* Suggestions chips */}
                <div style={{ marginBottom: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: textSub, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                    Sugerencias Rápidas (Clic para agregar o quitar):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {FEATURE_SUGGESTIONS.map((sug) => {
                      const isSelected = featureList.includes(sug);
                      return (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => handleToggleSuggestion(sug)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 16,
                            border: `1px solid ${isSelected ? gold : borderCol}`,
                            background: isSelected ? '#f5ede0' : white,
                            color: isSelected ? gold : textSub,
                            fontSize: 11,
                            fontWeight: isSelected ? 600 : 400,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isSelected ? (
                            <CheckCircle2 style={{ width: 12, height: 12, color: gold }} />
                          ) : (
                            <span style={{ color: textMuted, fontWeight: 700 }}>+</span>
                          )}
                          <span>{sug}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected features list */}
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: textSub, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                    Características seleccionadas ({featureList.length}):
                  </span>
                  {featureList.length === 0 ? (
                    <p style={{ fontSize: 11, color: textMuted, fontStyle: 'italic', margin: 0, padding: '10px 14px', background: white, borderRadius: 8, border: `1px dashed ${borderCol}` }}>
                      No hay características agregadas todavía. Puedes hacer clic en las sugerencias rápidas arriba o escribir una personalizada.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {featureList.map((feat, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: white,
                            border: `1px solid ${gold}`,
                            borderRadius: 8,
                            padding: '6px 10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 12,
                            color: textMain,
                            boxShadow: '0 1px 3px rgba(200,155,92,0.1)',
                          }}
                        >
                          <CheckCircle2 style={{ width: 13, height: 13, color: gold, flexShrink: 0 }} />
                          <span>{feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            title="Eliminar característica"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: textMuted,
                              cursor: 'pointer',
                              padding: 2,
                              display: 'flex',
                              alignItems: 'center',
                              marginLeft: 2,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                          >
                            <X style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="feat" {...register('featured')} />
                <label htmlFor="feat" style={{ fontSize: 13, color: textSub, cursor: 'pointer' }}>Marcar como Inmueble Destacado</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '9px 20px', borderRadius: 8, border: `1px solid ${borderCol}`, background: white, color: textSub, fontSize: 13, cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: gold, color: white, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {isSubmitting ? 'Guardando...' : 'Guardar Propiedad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MARCAR VENDIDO/ALQUILADO MODAL ────────────────────────────── */}
      {markModal.open && markModal.prop && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setMarkModal({ prop: null, open: false }); }}
        >
          <div style={{ background: white, border: `1px solid ${borderCol}`, borderRadius: 16, padding: 32, width: '100%', maxWidth: 460 }}>
            {/* Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5ede0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 style={{ width: 24, height: 24, color: gold }} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, color: textMain, margin: 0 }}>
                  Marcar como Vendido / Alquilado
                </h2>
                <p style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{markModal.prop.title}</p>
              </div>
            </div>

            <p style={{ fontSize: 13, color: textSub, lineHeight: 1.6, marginBottom: 20, background: '#f9f6f1', padding: 12, borderRadius: 8, border: `1px solid ${borderCol}` }}>
              Al confirmar, esta propiedad se moverá a <strong>Casos de Éxito</strong> y su estado cambiará automáticamente.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Estado final *</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['VENDIDO', 'ALQUILADO'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setMarkStatus(s as any)}
                      style={{
                        flex: 1,
                        padding: '9px 0',
                        borderRadius: 8,
                        border: `2px solid ${markStatus === s ? gold : borderCol}`,
                        background: markStatus === s ? '#f5ede0' : white,
                        color: markStatus === s ? gold : textSub,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Nombre del Cliente / Comprador (opcional)</label>
                <input
                  value={markClient}
                  onChange={(e) => setMarkClient(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Descripción del Caso de Éxito (opcional)</label>
                <textarea
                  rows={3}
                  value={markDesc}
                  onChange={(e) => setMarkDesc(e.target.value)}
                  placeholder="Cuéntanos cómo se cerró este negocio..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => setMarkModal({ prop: null, open: false })}
                style={{ padding: '9px 20px', borderRadius: 8, border: `1px solid ${borderCol}`, background: white, color: textSub, fontSize: 13, cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmMark}
                disabled={markLoading}
                style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: gold, color: white, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                {markLoading ? 'Confirmando...' : '✓ Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
