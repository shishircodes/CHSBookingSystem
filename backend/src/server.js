import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/validate.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`CHS API running on http://localhost:${port}`));
