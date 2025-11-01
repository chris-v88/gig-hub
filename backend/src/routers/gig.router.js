import express from 'express';
import { gigController } from '../controllers/gig.controller.js';
import { protect } from '../common/middlewares/protect.middleware.js';

const gigRouter = express.Router();

// Protected routes (require authentication) 
gigRouter.post('/', protect, gigController.create);

// Public specific routes (must come before /:id to prevent conflicts)
gigRouter.get('/search', gigController.search);
gigRouter.get('/search-pagination', gigController.searchPagination);
gigRouter.get('/categories-menu', gigController.getJobTypeMenu);
gigRouter.get('/category-details/:categoryId', gigController.getJobTypeDetails);
gigRouter.get('/by-subcategory/:subcategoryId', gigController.getGigsBySubcategory);
gigRouter.get('/by-user/:userId', gigController.getGigsByUser);
gigRouter.get('/details/:id', gigController.getGigDetails); // Match frontend expectation
gigRouter.get('/by-name/:gigName', gigController.getGigsByName);

// General routes (must come after specific routes)
gigRouter.get('/', gigController.findAll);
gigRouter.get('/:id', gigController.findOne); // Safe after specific routes

// Protected routes (require authentication)
gigRouter.put('/:id', protect, gigController.update);
gigRouter.delete('/:id', protect, gigController.remove);

// Image upload routes
gigRouter.post('/upload-image/:gigId', protect, gigController.uploadGigImage);

// Review routes
gigRouter.post('/:id/reviews', protect, gigController.createReview);

export default gigRouter;