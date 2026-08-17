import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

export const propertySchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  location: z.string().min(2, 'La ubicación es requerida'),
  price: z.number().positive('El precio debe ser un número positivo'),
  operation: z.enum(['VENTA', 'ALQUILER']),
  type: z.enum(['CASA', 'DEPARTAMENTO', 'OFICINA', 'TERRENO', 'LOCAL_COMERCIAL']),
  area: z.number().positive('El área debe ser positiva'),
  beds: z.number().min(0).default(0),
  baths: z.number().min(0).default(0),
  image: z.string().min(1, 'La imagen principal es requerida'),
  images: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  featured: z.boolean().default(false),
  status: z.enum(['DISPONIBLE', 'ALQUILADO', 'VENDIDO', 'RESERVADO']).default('DISPONIBLE'),
  description: z.string().optional(),
  address: z.string().optional(),
  districtId: z.string().optional().nullable(),
});

export const districtSchema = z.object({
  name: z.string().min(2, 'El nombre del distrito es requerido'),
  image: z.string().min(1, 'La imagen del distrito es requerida'),
  description: z.string().optional(),
});

export const representativeSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  role: z.string().min(2, 'El cargo o rol es requerido'),
  image: z.string().min(1, 'La imagen es requerida'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, 'El mensaje debe contener al menos 5 caracteres'),
});

export const storySchema = z.object({
  title: z.string().min(3, 'El título es requerido'),
  description: z.string().min(5, 'La descripción es requerida'),
  image: z.string().min(1, 'La imagen es requerida'),
  clientName: z.string().optional(),
});
