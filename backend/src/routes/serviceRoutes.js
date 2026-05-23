import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authRequired, requireRole } from '../middleware/auth.js';
import {
  listServices, getService, createService, updateService, deleteService, serviceSchema,
} from '../controllers/serviceController.js';

const router = Router();
router.get('/', listServices);
router.get('/:id', getService);
router.post('/', authRequired, requireRole('admin', 'provider'), validate(serviceSchema), createService);
router.put('/:id', authRequired, requireRole('admin', 'provider'), updateService);
router.delete('/:id', authRequired, requireRole('admin', 'provider'), deleteService);
export default router;
