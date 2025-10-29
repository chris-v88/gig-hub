import express from 'express';
import { reviewController } from '../controllers/review.controller.js';
import { protect } from '../common/middlewares/protect.middleware.js';

const reviewRouter = express.Router();

// Review routes (BinhLuan)
reviewRouter.get('/', reviewController.findAll);
reviewRouter.post('/', protect, reviewController.create);
reviewRouter.put('/:id', protect, reviewController.update);
reviewRouter.delete('/:id', protect, reviewController.remove);
reviewRouter.get('/by-gig/:gigId', reviewController.getByGig);

export default reviewRouter;