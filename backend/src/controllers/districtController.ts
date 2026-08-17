import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { districtSchema } from '../schemas/zodSchemas';

const slugify = (text: string) =>
  text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

export const getDistricts = async (req: Request, res: Response): Promise<void> => {
  try {
    const districts = await prisma.district.findMany({
      include: {
        _count: { select: { properties: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json(districts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los distritos' });
  }
};

export const createDistrict = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = districtSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const { name, image, description } = parseResult.data;
    const slug = slugify(name);

    const district = await prisma.district.create({
      data: { name, slug, image, description },
    });

    res.status(201).json(district);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el distrito' });
  }
};

export const updateDistrict = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = districtSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const updateData: any = { ...parseResult.data };
    if (updateData.name) {
      updateData.slug = slugify(updateData.name);
    }

    const updated = await prisma.district.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el distrito' });
  }
};

export const deleteDistrict = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.district.delete({ where: { id } });
    res.json({ message: 'Distrito eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el distrito' });
  }
};
