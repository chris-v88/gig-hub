import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { protect } from '../common/middlewares/protect.middleware.js';

const userRouter = express.Router();

// User routes (NguoiDung)
userRouter.get('/', userController.findAll);
userRouter.post('/', userController.create);
userRouter.delete('/', protect, userController.remove); // Using query param for ID
userRouter.get('/search-pagination', userController.searchPagination);
userRouter.get('/search/:username', userController.searchByName);
userRouter.get('/:id', userController.findOne);
userRouter.put('/:id', protect, userController.update);

// Avatar upload route
userRouter.post('/upload-avatar', protect, userController.uploadAvatar);

export default userRouter;