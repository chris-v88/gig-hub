import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/auth.js';
import { appError } from './src/common/app-error/app-error.error.js';
import { responseError } from './src/common/helpers/response.helpers.js';

const app = express();
const PORT = process.env.PORT || 3069;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'GigHub API is running!' });
});

// Error handling middleware (must be last)
app.use(appError);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});