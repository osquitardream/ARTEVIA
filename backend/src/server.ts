import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import districtRoutes from './routes/districtRoutes';
import repRoutes from './routes/repRoutes';
import contactRoutes from './routes/contactRoutes';
import storyRoutes from './routes/storyRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
// Limit increased to 15mb to allow base64-encoded images sent directly in JSON payloads
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/districts', districtRoutes);
app.use('/api/v1/reps', repRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/v1/stories', storyRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling fallback
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 ARTEVIA Backend Server running on http://localhost:${PORT}`);
});
