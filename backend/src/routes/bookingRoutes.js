import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authRequired, requireRole } from '../middleware/auth.js';
import {
  listBookings, createBooking, updateBookingStatus, deleteBooking,
  createBookingSchema, updateStatusSchema,
} from '../controllers/bookingController.js';

const router = Router();
router.use(authRequired);
router.get('/', listBookings);
router.post('/', requireRole('patient'), validate(createBookingSchema), createBooking);
router.patch('/:id/status', validate(updateStatusSchema), updateBookingStatus);
router.delete('/:id', deleteBooking);
export default router;
