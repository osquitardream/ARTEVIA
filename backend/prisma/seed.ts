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
      name: 'La Molina',
      slug: 'la-molina',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Zonas residenciales de alto valor y exclusividad.',
    },
    {
      name: 'San Isidro',
      slug: 'san-isidro',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Centro financiero con desarrollos ejecutivos de primera clase.',
    },
    {
      name: 'Miraflores',
      slug: 'miraflores',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Vista al mar, áreas turísticas y departamentos modernos.',
    },
    {
      name: 'Cajamarca',
      slug: 'cajamarca',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Terrenos amplios e inmuebles de alta plusvalía.',
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
      email: 'olimaym18@gmail.com',
      phone: '+51 954 430 927',
      order: 1,
    },
    {
      name: 'Valentina Torres',
      role: 'DIRECTORA COMERCIAL',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      email: 'olimaym18@gmail.com',
      phone: '+51 954 430 927',
      order: 2,
    },
    {
      name: 'Carlos Mendoza',
      role: 'AGENTE SENIOR',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      email: 'olimaym18@gmail.com',
      phone: '+51 954 430 927',
      order: 3,
    },
  ];

  for (const rep of reps) {
    await prisma.representative.create({ data: rep });
  }
  console.log('✅ Representatives seeded');

  // 4. Seed Properties
  const laMolina = await prisma.district.findUnique({ where: { slug: 'la-molina' } });
  const sanIsidro = await prisma.district.findUnique({ where: { slug: 'san-isidro' } });
  const miraflores = await prisma.district.findUnique({ where: { slug: 'miraflores' } });
  const cajamarca = await prisma.district.findUnique({ where: { slug: 'cajamarca' } });

  const properties = [
    {
      title: 'Casa de Lujo en La Molina',
      slug: 'casa-de-lujo-en-la-molina',
      location: 'La Molina',
      price: 1500000,
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
      description: 'Hermosa propiedad de lujo con acabados de granito, piscina climatizada y áreas verdes.',
      features: [
        'Seguridad 24/7 y control de acceso',
        'Excelente iluminación natural',
        'Documentación inscrita en Registros Públicos',
        'Cercano a avenidas principales y zonas comerciales',
      ],
      districtId: laMolina?.id,
    },
    {
      title: 'Departamento Exclusivo San Isidro',
      slug: 'departamento-exclusivo-san-isidro',
      location: 'San Isidro',
      price: 3500,
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
      description: 'Departamento moderno totalmente amoblado con vista al golf.',
      features: [
        'Seguridad 24/7 y control de acceso',
        'Excelente iluminación natural',
        'Documentación inscrita en Registros Públicos',
        'Cercano a avenidas principales y zonas comerciales',
      ],
      districtId: sanIsidro?.id,
    },
    {
      title: 'Oficina Premium Miraflores',
      slug: 'oficina-premium-miraflores',
      location: 'Miraflores',
      price: 800000,
      operation: OperationType.VENTA,
      type: PropertyType.OFICINA,
      area: 85,
      beds: 1,
      baths: 2,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
      status: PropertyStatus.ALQUILADO,
      description: 'Oficina ejecutiva con certificación LEED y salas de conferencias.',
      features: [
        'Seguridad 24/7 y control de acceso',
        'Excelente iluminación natural',
        'Documentación inscrita en Registros Públicos',
        'Cercano a avenidas principales y zonas comerciales',
      ],
      districtId: miraflores?.id,
    },
    {
      title: 'Terreno Campestre Exclusivo Cajamarca',
      slug: 'terreno-campestre-exclusivo-cajamarca',
      location: 'Cajamarca',
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
      description: 'Amplio terreno campestre con vistas panorámicas al valle de Cajamarca, ideal para casa de campo o proyecto ecológico.',
      features: [
        'Acceso directo a vía principal',
        'Servicios de agua y luz disponibles',
        'Título de propiedad saneado e inscrito en Sunarp',
        'Entorno natural con clima privilegiado',
      ],
      districtId: cajamarca?.id,
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
      title: 'Venta Récord Residencia La Molina',
      description: 'Logramos la transacción y cierre de venta en menos de 15 días con total satisfacción del cliente.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      clientName: 'Familia Ramírez',
    },
    {
      title: 'Alquiler Corporativo San Isidro',
      description: 'Asesoría integral para la colocación de oficinas de alta gama a multinacional tecnológica.',
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
