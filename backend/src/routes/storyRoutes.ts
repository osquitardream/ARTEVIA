import { Router } from 'express';
import { getStories, createStory, deleteStory } from '../controllers/storyController';
import { reactivarPropiedad } from '../controllers/propertyController';
import { authenticateJWT, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', getStories);
router.post('/', authenticateJWT, requireRole(['ADMIN', 'GERENCIA', 'MARKETING']), createStory);
router.patch('/:id/reactivar', authenticateJWT, requireRole(['ADMIN', 'VENTAS', 'GERENCIA']), reactivarPropiedad);
router.delete('/:id', authenticateJWT, requireRole(['ADMIN', 'GERENCIA']), deleteStory);

export default router;
