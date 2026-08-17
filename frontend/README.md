# ARTEVIA - Frontend (Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui)

Este es el cliente web y panel de administración de **ARTEVIA Inmobiliaria**.

## 🚀 Tecnologías

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: shadcn/ui (Button, Dialog, Table, Card, Form, Select, Badge, Toast/Sonner)
- **Formularios & Validación**: React Hook Form + Zod
- **Estado Reactivo Client**: Zustand (`useAuthStore`, `useFilterStore`)
- **Iconos**: Lucide React

## 🛠️ Ejecución en Desarrollo

1. Asegúrate de que el **Backend** esté corriendo en `http://localhost:4000`.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔑 Rutas Principales

- `/`: Página de inicio (Hero, Filtros interactivos, Destacados, Distritos, Testimonios)
- `/propiedades`: Catálogo completo de inmuebles con filtrado Zustand reactivo
- `/propiedades/[id]`: Detalle técnico de la propiedad con galería
- `/nosotros`: Información corporativa y equipo de representantes
- `/exitos`: Casos de éxito e historias de clientes
- `/contacto`: Formulario de atención enviado al backend API
- `/intranet`: Login seguro de administración
- `/admin`: Dashboard privado (Métricas, CRUD de Propiedades, Distritos, Representantes, Leads y Éxitos)
