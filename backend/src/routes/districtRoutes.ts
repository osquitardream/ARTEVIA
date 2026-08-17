import { Router } from 'express';
import {
  getDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} from '../controllers/districtController';
import { authenticateJWT, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', getDistricts);
router.post('/', authenticateJWT, requireRole(['ADMIN', 'GERENCIA', 'MARKETING']), createDistrict);
router.put('/:id', authenticateJWT, requireRole(['ADMIN', 'GERENCIA', 'MARKETING']), updateDistrict);
router.delete('/:id', authenticateJWT, requireRole(['ADMIN', 'GERENCIA']), deleteDistrict);

export default router;
