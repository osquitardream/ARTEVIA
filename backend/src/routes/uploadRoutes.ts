import { Router, Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticateJWT, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se ha adjuntado ningún archivo' });
      return;
    }

    // Convert memory buffer to base64 for Cloudinary upload stream
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'artevia_properties',
      resource_type: 'auto',
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ error: 'Error al subir la imagen a Cloudinary' });
  }
});

export default router;
