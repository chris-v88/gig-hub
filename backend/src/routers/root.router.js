import express from 'express';

import authRoutes from '../routers/auth.router.js';
import gigRoutes from '../routers/gig.router.js';
import categoryRoutes from '../routers/category.router.js';
import subcategoryRoutes from '../routers/subcategory.router.js';
import reviewRoutes from '../routers/review.router.js';
import userRoutes from '../routers/user.router.js';
import orderRoutes from '../routers/order.router.js';
import skillRoutes from '../routers/skill.router.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/gigs', gigRoutes); // CongViec
rootRouter.use('/categories', categoryRoutes); // LoaiCongViec  
rootRouter.use('/subcategories', subcategoryRoutes); // ChiTietLoaiCongViec
rootRouter.use('/reviews', reviewRoutes); // BinhLuan
rootRouter.use('/users', userRoutes); // NguoiDung
rootRouter.use('/orders', orderRoutes); // ThueCongViec
rootRouter.use('/skills', skillRoutes); // Skills

export default rootRouter;