import express from 'express';

import authRoutes from '../routers/auth.router.js';
import gigRoutes from '../routers/gig.router.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/gigs', gigRoutes);

export default rootRouter;