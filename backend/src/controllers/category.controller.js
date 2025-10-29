import { categoryService } from '../services/category.service.js';
import { responseSuccess } from '../common/helpers/response.helpers.js';
import { statusCodes } from '../common/helpers/status-code.helper.js';

export const categoryController = {
  // GET /api/loai-cong-viec
  findAll: async (req, res, next) => {
    try {
      const result = await categoryService.findAll(req);
      const response = responseSuccess(result, 'Get all job categories successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/loai-cong-viec
  create: async (req, res, next) => {
    try {
      const result = await categoryService.create(req);
      const response = responseSuccess(result, 'Create job category successfully', statusCodes.CREATED);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/loai-cong-viec/phan-trang-tim-kiem
  searchPagination: async (req, res, next) => {
    try {
      const result = await categoryService.searchPagination(req);
      const response = responseSuccess(result, 'Search job categories successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/loai-cong-viec/:id
  findOne: async (req, res, next) => {
    try {
      const result = await categoryService.findOne(req);
      const response = responseSuccess(result, `Get job category #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/loai-cong-viec/:id
  update: async (req, res, next) => {
    try {
      const result = await categoryService.update(req);
      const response = responseSuccess(result, `Update job category #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/loai-cong-viec/:id
  remove: async (req, res, next) => {
    try {
      const result = await categoryService.remove(req);
      const response = responseSuccess(result, `Delete job category #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};