import { PrismaClient, Role, OperationType, PropertyType, PropertyStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Users
  const defaultPassword = await bcrypt.hash('artevia123', 10);
  const users = [
    { email: 'administracion@arteviainmobiliaria.com', name: 'Administración Artevia', role: Role.ADMIN },
    { email: 'ventas@arteviainmobiliaria.com', name: 'Agente Ventas', role: Role.VENTAS },
    { email: 'gerencia@arteviainmobiliaria.com', name: 'Gerencia General', role: Role.GERENCIA },
    { email: 'marketing@arteviainmobiliaria.com', name: 'Jefe Marketing', role: Role.MARKETING },
    { email: 'soporte@arteviainmobiliaria.com', name: 'Soporte Técnico', role: Role.SOPORTE },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: defaultPassword,
        role: user.role,
      },
    });
  }
  console.log('✅ Users seeded');

  // 2. Seed Districts
  const districts = [
    {
      name: 'Baños del Inca',
      slug: 'banos-del-inca',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Zona residencial campestre y turística de alto valor y exclusividad.',
    },
    {
      name: 'Cajamarca Centro',
      slug: 'cajamarca-centro',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Centro histórico y comercial con desarrollos ejecutivos y departamentos.',
    },
    {
      name: 'Llacanora',
      slug: 'llacanora',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Terrenos amplios y casas de campo con excelente clima y alta plusvalía.',
    },
    {
      name: 'Santa Bárbara',
      slug: 'santa-barbara',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Área residencial tranquila y segura con rápido acceso a la ciudad.',
    },
  ];

  for (const dist of districts) {
    await prisma.district.upsert({
      where: { slug: dist.slug },
      update: {},
      create: dist,
    });
  }
  console.log('✅ Districts seeded');

  // 3. Seed Representatives
  const reps = [
    {
      name: 'Alejandro Vargas',
      role: 'DIRECTOR GENERAL',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      email: 'arteviainmobiliaria@gmail.com',
      phone: '+51 965 355 800',
      order: 1,
    },
    {
      name: 'Valentina Torres',
      role: 'DIRECTORA COMERCIAL',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      email: 'arteviainmobiliaria@gmail.com',
      phone: '+51 965 355 800',
      order: 2,
    },
    {
      name: 'Carlos Mendoza',
      role: 'AGENTE SENIOR',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      email: 'arteviainmobiliaria@gmail.com',
      phone: '+51 965 355 800',
      order: 3,
    },
  ];

  for (const rep of reps) {
    await prisma.representative.create({ data: rep });
  }
  console.log('✅ Representatives seeded');

  // 4. Seed Properties
  const banosDelInca = await prisma.district.findUnique({ where: { slug: 'banos-del-inca' } });
  const cajamarcaCentro = await prisma.district.findUnique({ where: { slug: 'cajamarca-centro' } });
  const llacanora = await prisma.district.findUnique({ where: { slug: 'llacanora' } });
  const santaBarbara = await prisma.district.findUnique({ where: { slug: 'santa-barbara' } });

  const properties = [
    {
      title: 'Residencia Exclusiva en Baños del Inca',
      slug: 'residencia-exclusiva-en-banos-del-inca',
      location: 'Baños del Inca',
      price: 850000,
      operation: OperationType.VENTA,
      type: PropertyType.CASA,
      area: 450,
      beds: 4,
      baths: 5,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
      status: PropertyStatus.DISPONIBLE,
      description: 'Hermosa residencia campestre de lujo con acabados de primera, jardines amplios y piscina climatizada en Baños del Inca.',
      features: [
        'Seguridad 24/7 y control de acceso',
        'Excelente iluminación natural y clima cálido',
        'Documentación inscrita en Registros Públicos (Sunarp)',
        'Cercano a zonas comerciales y termales',
      ],
      districtId: banosDelInca?.id,
    },
    {
      title: 'Departamento Moderno Cajamarca Centro',
      slug: 'departamento-moderno-cajamarca-centro',
      location: 'Cajamarca Centro',
      price: 2500,
      operation: OperationType.ALQUILER,
      type: PropertyType.DEPARTAMENTO,
      area: 120,
      beds: 2,
      baths: 2,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
      status: PropertyStatus.DISPONIBLE,
      description: 'Departamento moderno totalmente equipado en el corazón de Cajamarca, con vista panorámica y acabados premium.',
      features: [
        'Seguridad 24/7 y cámaras de vigilancia',
        'Ascensor directo y cochera privada',
        'Documentación en regla',
        'A pocos minutos de centros comerciales y bancos',
      ],
      districtId: cajamarcaCentro?.id,
    },
    {
      title: 'Terreno Campestre Exclusivo Llacanora',
      slug: 'terreno-campestre-exclusivo-llacanora',
      location: 'Llacanora',
      price: 450000,
      operation: OperationType.VENTA,
      type: PropertyType.TERRENO,
      area: 1200,
      beds: 0,
      baths: 0,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
      status: PropertyStatus.DISPONIBLE,
      description: 'Amplio terreno campestre con vistas panorámicas al valle de Llacanora, ideal para casa de campo o proyecto ecológico.',
      features: [
        'Acceso directo a vía principal',
        'Servicios de agua y luz disponibles',
        'Título de propiedad saneado e inscrito en Sunarp',
        'Entorno natural con clima privilegiado todo el año',
      ],
      districtId: llacanora?.id,
    },
    {
      title: 'Casa Moderna en Santa Bárbara',
      slug: 'casa-moderna-en-santa-barbara',
      location: 'Santa Bárbara',
      price: 680000,
      operation: OperationType.VENTA,
      type: PropertyType.CASA,
      area: 280,
      beds: 3,
      baths: 3,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
      status: PropertyStatus.DISPONIBLE,
      description: 'Casa contemporánea de 3 niveles con acabados en madera nativa, terraza y estacionamiento para 2 vehículos.',
      features: [
        'Zona residencial tranquila',
        'Acabados de primera calidad',
        'Documentación lista para transferencia bancaria',
        'Excelente distribución e iluminación',
      ],
      districtId: santaBarbara?.id,
    },
  ];

  for (const prop of properties) {
    await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {},
      create: prop,
    });
  }
  console.log('✅ Properties seeded');

  // 5. Seed Success Stories
  const stories = [
    {
      title: 'Venta Récord Residencia Baños del Inca',
      description: 'Logramos la transacción y cierre de venta en menos de 15 días con total satisfacción del cliente en Baños del Inca.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      clientName: 'Familia Ramírez',
    },
    {
      title: 'Alquiler Corporativo Cajamarca Centro',
      description: 'Asesoría integral para la colocación de inmuebles ejecutivos de alta gama en Cajamarca.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      clientName: 'TechCorp International',
    },
  ];

  for (const story of stories) {
    await prisma.successStory.create({ data: story });
  }
  console.log('✅ Success stories seeded');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
