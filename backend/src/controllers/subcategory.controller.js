import { subcategoryService } from '../services/subcategory.service.js';
import { responseSuccess } from '../common/helpers/response.helpers.js';
import { statusCodes } from '../common/helpers/status-code.helper.js';

export const subcategoryController = {
  // GET /api/chi-tiet-loai-cong-viec
  findAll: async (req, res, next) => {
    try {
      const result = await subcategoryService.findAll(req);
      const response = responseSuccess(result, 'Get all job subcategories successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/chi-tiet-loai-cong-viec
  create: async (req, res, next) => {
    try {
      const result = await subcategoryService.create(req);
      const response = responseSuccess(result, 'Create job subcategory successfully', statusCodes.CREATED);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/chi-tiet-loai-cong-viec/phan-trang-tim-kiem
  searchPagination: async (req, res, next) => {
    try {
      const result = await subcategoryService.searchPagination(req);
      const response = responseSuccess(result, 'Search job subcategories successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/chi-tiet-loai-cong-viec/:id
  findOne: async (req, res, next) => {
    try {
      const result = await subcategoryService.findOne(req);
      const response = responseSuccess(result, `Get job subcategory #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/chi-tiet-loai-cong-viec/:id
  update: async (req, res, next) => {
    try {
      const result = await subcategoryService.update(req);
      const response = responseSuccess(result, `Update job subcategory #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/chi-tiet-loai-cong-viec/:id
  remove: async (req, res, next) => {
    try {
      const result = await subcategoryService.remove(req);
      const response = responseSuccess(result, `Delete job subcategory #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/chi-tiet-loai-cong-viec/them-nhom-chi-tiet-loai
  createGroup: async (req, res, next) => {
    try {
      const result = await subcategoryService.createGroup(req);
      const response = responseSuccess(result, 'Create subcategory group successfully', statusCodes.CREATED);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/chi-tiet-loai-cong-viec/sua-nhom-chi-tiet-loai/:id
  updateGroup: async (req, res, next) => {
    try {
      const result = await subcategoryService.updateGroup(req);
      const response = responseSuccess(result, `Update subcategory group #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/chi-tiet-loai-cong-viec/upload-hinh-nhom-loai-cong-viec/:MaNhomLoaiCongViec
  uploadGroupImage: async (req, res, next) => {
    try {
      const result = await subcategoryService.uploadGroupImage(req);
      const response = responseSuccess(result, 'Upload group image successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};