import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { propertySchema } from '../schemas/zodSchemas';

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const { operation, type, location, minPrice, maxPrice, featured, search } = req.query;

    const where: any = {};

    if (operation && operation !== 'all') {
      where.operation = (operation as string).toUpperCase();
    }
    if (type && type !== 'all') {
      where.type = (type as string).toUpperCase();
    }
    if (location && location !== 'all') {
      where.location = { contains: location as string, mode: 'insensitive' };
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const properties = await prisma.property.findMany({
      where,
      include: { district: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Error al obtener las propiedades' });
  }
};

export const getPropertyBySlugOrId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;

    const property = await prisma.property.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: { district: true },
    });

    if (!property) {
      res.status(404).json({ error: 'Propiedad no encontrada' });
      return;
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalle de la propiedad' });
  }
};

export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = propertySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const data = parseResult.data;
    if (data.images && data.images.length > 0 && !data.image) {
      data.image = data.images[0];
    } else if (data.image && (!data.images || data.images.length === 0)) {
      data.images = [data.image];
    }

    let baseSlug = slugify(data.title);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.property.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newProperty = await prisma.property.create({
      data: {
        ...data,
        slug,
      },
    });

    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Error al crear la propiedad' });
  }
};

export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = propertySchema.partial().safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const data = parseResult.data;
    if (data.images && data.images.length > 0 && !data.image) {
      data.image = data.images[0];
    } else if (data.image && (!data.images || data.images.length === 0)) {
      data.images = [data.image];
    }

    const updated = await prisma.property.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la propiedad' });
  }
};

export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.property.delete({ where: { id } });
    res.json({ message: 'Propiedad eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la propiedad' });
  }
};

export const marcarVendido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newStatus, storyTitle, storyDescription, clientName } = req.body;

    if (!newStatus || !['VENDIDO', 'ALQUILADO'].includes(newStatus)) {
      res.status(400).json({ error: 'Estado inválido. Debe ser VENDIDO o ALQUILADO.' });
      return;
    }

    // Update the property status
    const property = await prisma.property.update({
      where: { id },
      data: { status: newStatus },
    });

    // Auto-create a SuccessStory linked to this property
    const story = await prisma.successStory.create({
      data: {
        title: storyTitle || `${property.title} — ${newStatus === 'VENDIDO' ? 'Vendido' : 'Alquilado'}`,
        description: storyDescription || `Propiedad ${newStatus === 'VENDIDO' ? 'vendida' : 'alquilada'} exitosamente.`,
        image: property.image,
        clientName: clientName || null,
        propertyId: property.id,
      },
    });

    res.json({ property, story });
  } catch (error) {
    console.error('Error en marcarVendido:', error);
    res.status(500).json({ error: 'Error al marcar como vendido/alquilado' });
  }
};

export const reactivarPropiedad = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // story id

    // Find the story to get propertyId
    const story = await prisma.successStory.findUnique({ where: { id } });
    if (!story) {
      res.status(404).json({ error: 'Caso de éxito no encontrado' });
      return;
    }

    // Delete the story
    await prisma.successStory.delete({ where: { id } });

    // If story has a linked property, revert status
    if (story.propertyId) {
      await prisma.property.update({
        where: { id: story.propertyId },
        data: { status: 'DISPONIBLE' },
      });
    }

    res.json({ message: 'Propiedad reactivada correctamente' });
  } catch (error) {
    console.error('Error en reactivarPropiedad:', error);
    res.status(500).json({ error: 'Error al reactivar la propiedad' });
  }
};
