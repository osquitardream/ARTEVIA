import { Router } from 'express';
import { getReps, createRep, updateRep, deleteRep } from '../controllers/repController';
import { authenticateJWT, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', getReps);
router.post('/', authenticateJWT, requireRole(['ADMIN', 'GERENCIA']), createRep);
router.put('/:id', authenticateJWT, requireRole(['ADMIN', 'GERENCIA']), updateRep);
router.delete('/:id', authenticateJWT, requireRole(['ADMIN', 'GERENCIA']), deleteRep);

export default router;
