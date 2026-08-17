import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { storySchema } from '../schemas/zodSchemas';

export const getStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const stories = await prisma.successStory.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historias de éxito' });
  }
};

export const createStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = storySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const story = await prisma.successStory.create({
      data: parseResult.data,
    });

    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear historia de éxito' });
  }
};

export const deleteStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.successStory.delete({ where: { id } });
    res.json({ message: 'Historia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar historia' });
  }
};
