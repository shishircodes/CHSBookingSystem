import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authRequired, requireRole } from '../middleware/auth.js';
import {
  listUsers, createUser, updateUser, deleteUser,
  createUserSchema, updateUserSchema,
} from '../controllers/userController.js';

const router = Router();
router.use(authRequired, requireRole('admin'));
router.get('/', listUsers);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);
export default router;
