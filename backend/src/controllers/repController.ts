import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { representativeSchema } from '../schemas/zodSchemas';

export const getReps = async (req: Request, res: Response): Promise<void> => {
  try {
    const reps = await prisma.representative.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(reps);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener representantes' });
  }
};

export const createRep = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = representativeSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const rep = await prisma.representative.create({
      data: parseResult.data,
    });

    res.status(201).json(rep);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear representante' });
  }
};

export const updateRep = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = representativeSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const updated = await prisma.representative.update({
      where: { id },
      data: parseResult.data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar representante' });
  }
};

export const deleteRep = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.representative.delete({ where: { id } });
    res.json({ message: 'Representante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar representante' });
  }
};
