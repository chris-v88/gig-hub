import express from 'express';
import { subcategoryController } from '../controllers/subcategory.controller.js';
import { protect } from '../common/middlewares/protect.middleware.js';

const subcategoryRouter = express.Router();

// Subcategory routes (ChiTietLoaiCongViec)
subcategoryRouter.get('/', subcategoryController.findAll);
subcategoryRouter.post('/', protect, subcategoryController.create);
subcategoryRouter.get('/search-pagination', subcategoryController.searchPagination);
subcategoryRouter.get('/:id', subcategoryController.findOne);
subcategoryRouter.put('/:id', protect, subcategoryController.update);
subcategoryRouter.delete('/:id', protect, subcategoryController.remove);

// Group management routes
subcategoryRouter.post('/create-group', protect, subcategoryController.createGroup);
subcategoryRouter.put('/update-group/:id', protect, subcategoryController.updateGroup);
subcategoryRouter.post('/upload-group-image/:groupId', protect, subcategoryController.uploadGroupImage);

export default subcategoryRouter;