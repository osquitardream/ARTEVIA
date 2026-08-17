# ARTEVIA - Backend API (Express + Prisma + Neon PostgreSQL)

Servicio RESTful API y gestión de base de datos para **ARTEVIA Inmobiliaria**.

## 🚀 Tecnologías

- **Runtime & Servidor**: Node.js + Express + TypeScript
- **ORM**: Prisma ORM
- **Base de Datos**: PostgreSQL (Neon Serverless)
- **Autenticación**: JWT (JSON Web Tokens) + bcryptjs
- **Validación de Datos**: Zod Schemas
- **Almacenamiento de Imágenes**: Cloudinary SDK (vía endpoint Multer stream `/api/v1/upload`)

## 🔑 Variables de Entorno (`.env`)

```env
PORT=4000
DATABASE_URL="postgresql://neondb_owner:npg_xexample@ep-example-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:npg_xexample@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="artevia_super_secret_jwt_key"
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
```

## 🛠️ Comandos

- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática en `http://localhost:4000`
- `npm run build`: Compila TypeScript a código JavaScript optimizado en `dist/`
- `npm run start`: Inicia el servidor compilado de producción
- `npx prisma generate`: Genera el cliente Prisma con los tipos TypeScript
- `npx prisma db push`: Sincroniza los modelos Prisma con PostgreSQL en Neon
- `npm run seed`: Pobla la base de datos Neon con los datos de inicio (Usuarios admin, Propiedades, Distritos, Representantes, Casos de éxito)

## 📌 Endpoints API (`/api/v1`)

- `POST /api/v1/auth/login`: Autenticación de personal
- `GET /api/v1/properties`: Listado y búsqueda de propiedades
- `POST / PUT / DELETE /api/v1/properties`: CRUD de propiedades (Protegido JWT)
- `GET / POST / PUT / DELETE /api/v1/districts`: CRUD de distritos
- `GET / POST / PUT / DELETE /api/v1/reps`: CRUD de representantes de equipo
- `POST /api/v1/contacts`: Envío público de mensajes de contacto
- `GET / PATCH / DELETE /api/v1/contacts`: Bandeja de leads (Protegido JWT)
- `POST /api/v1/upload`: Subida directa de imágenes a Cloudinary (Protegido JWT)
