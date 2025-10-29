import express from 'express';
import { skillController } from '../controllers/skill.controller.js';
import { protect } from '../common/middlewares/protect.middleware.js';

const skillRouter = express.Router();

// Public routes
skillRouter.get('/', skillController.findAll);
skillRouter.get('/search-pagination', skillController.searchPagination);
skillRouter.get('/:id', skillController.findOne);

// Protected routes (require authentication)
skillRouter.post('/', protect, skillController.create);
skillRouter.put('/:id', protect, skillController.update);
skillRouter.delete('/:id', protect, skillController.remove);

export default skillRouter;