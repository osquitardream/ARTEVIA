import { Router } from 'express';
import {
  getProperties,
  getPropertyBySlugOrId,
  createProperty,
  updateProperty,
  deleteProperty,
  marcarVendido,
} from '../controllers/propertyController';
import { authenticateJWT, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', getProperties);
router.get('/:identifier', getPropertyBySlugOrId);

// Rutas protegidas para administración / personal
router.post('/', authenticateJWT, requireRole(['ADMIN', 'VENTAS', 'GERENCIA']), createProperty);
router.put('/:id', authenticateJWT, requireRole(['ADMIN', 'VENTAS', 'GERENCIA']), updateProperty);
router.patch('/:id/marcar-vendido', authenticateJWT, requireRole(['ADMIN', 'VENTAS', 'GERENCIA']), marcarVendido);
router.delete('/:id', authenticateJWT, requireRole(['ADMIN', 'GERENCIA']), deleteProperty);

export default router;
