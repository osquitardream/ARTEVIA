import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { contactSchema } from '../schemas/zodSchemas';
import { sendContactNotificationEmail } from '../utils/emailService';

export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mensajes de contacto' });
  }
};

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = contactSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const contact = await prisma.contactMessage.create({
      data: parseResult.data,
    });

    // Send email notification asynchronously
    sendContactNotificationEmail(contact).catch((err) => {
      console.error('Error enviando notificación de correo:', err);
    });

    res.status(201).json({ message: 'Mensaje de contacto enviado con éxito', contact });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el mensaje de contacto' });
  }
};

export const updateContactStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDIENTE', 'LEIDO', 'ATENDIDO'].includes(status)) {
      res.status(400).json({ error: 'Estado inválido' });
      return;
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado del contacto' });
  }
};

export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ message: 'Mensaje eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar mensaje' });
  }
};
