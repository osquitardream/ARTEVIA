import { Router } from 'express';
import {
  getContacts,
  createContact,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController';
import { authenticateJWT, requireRole } from '../middlewares/auth';

const router = Router();

router.post('/', createContact); // Público para clientes
router.get('/', authenticateJWT, requireRole(['ADMIN', 'VENTAS', 'GERENCIA', 'SOPORTE']), getContacts);
router.patch('/:id/status', authenticateJWT, requireRole(['ADMIN', 'VENTAS', 'GERENCIA', 'SOPORTE']), updateContactStatus);
router.delete('/:id', authenticateJWT, requireRole(['ADMIN', 'GERENCIA']), deleteContact);

export default router;
