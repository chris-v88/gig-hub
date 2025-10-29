import express from 'express';
import { orderController } from '../controllers/order.controller.js';
import { protect } from '../common/middlewares/protect.middleware.js';

const orderRouter = express.Router();

// Public routes
orderRouter.get('/', orderController.findAll);
orderRouter.get('/search-pagination', orderController.searchPagination);

// Protected specific routes (must come before /:id)
orderRouter.get('/user-orders', protect, orderController.getUserOrders);
orderRouter.post('/complete-order/:orderId', protect, orderController.completeOrder);

// General routes with parameters (must come after specific routes)
orderRouter.get('/:id', orderController.findOne);

// Protected routes (require authentication)
orderRouter.post('/', protect, orderController.create);
orderRouter.put('/:id', protect, orderController.update);
orderRouter.delete('/:id', protect, orderController.remove);

export default orderRouter;