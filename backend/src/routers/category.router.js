import express from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { protect } from '../common/middlewares/protect.middleware.js';

const categoryRouter = express.Router();

// Category routes (LoaiCongViec)
categoryRouter.get('/', categoryController.findAll);
categoryRouter.post('/', protect, categoryController.create);
categoryRouter.get('/search-pagination', categoryController.searchPagination);
categoryRouter.get('/:id', categoryController.findOne);
categoryRouter.put('/:id', protect, categoryController.update);
categoryRouter.delete('/:id', protect, categoryController.remove);

export default categoryRouter;