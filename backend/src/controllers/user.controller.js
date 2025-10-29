import { userService } from '../services/user.service.js';
import { responseSuccess } from '../common/helpers/response.helpers.js';
import { statusCodes } from '../common/helpers/status-code.helper.js';

export const userController = {
  // GET /api/users
  findAll: async (req, res, next) => {
    try {
      const result = await userService.findAll(req);
      const response = responseSuccess(result, 'Get all users successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/users
  create: async (req, res, next) => {
    try {
      const result = await userService.create(req);
      const response = responseSuccess(result, 'Create user successfully', statusCodes.CREATED);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/users
  remove: async (req, res, next) => {
    try {
      const result = await userService.remove(req);
      const response = responseSuccess(result, 'Delete user successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/users/phan-trang-tim-kiem
  searchPagination: async (req, res, next) => {
    try {
      const result = await userService.searchPagination(req);
      const response = responseSuccess(result, 'Search users successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/users/:id
  findOne: async (req, res, next) => {
    try {
      const result = await userService.findOne(req);
      const response = responseSuccess(result, `Get user #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/users/:id
  update: async (req, res, next) => {
    try {
      const result = await userService.update(req);
      const response = responseSuccess(result, `Update user #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/users/search/:TenNguoiDung
  searchByName: async (req, res, next) => {
    try {
      const result = await userService.searchByName(req);
      const response = responseSuccess(result, `Search users by name "${req.params.TenNguoiDung}" successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/users/upload-avatar
  uploadAvatar: async (req, res, next) => {
    try {
      const result = await userService.uploadAvatar(req);
      const response = responseSuccess(result, 'Upload avatar successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};