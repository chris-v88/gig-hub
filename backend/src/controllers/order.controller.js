import { orderService } from '../services/order.service.js';
import { responseSuccess } from '../common/helpers/response.helpers.js';
import { statusCodes } from '../common/helpers/status-code.helper.js';

export const orderController = {
  // GET /api/thue-cong-viec
  findAll: async (req, res, next) => {
    try {
      const result = await orderService.findAll(req);
      const response = responseSuccess(result, 'Get all job orders successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/thue-cong-viec
  create: async (req, res, next) => {
    try {
      const result = await orderService.create(req);
      const response = responseSuccess(result, 'Create job order successfully', statusCodes.CREATED);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/thue-cong-viec/phan-trang-tim-kiem
  searchPagination: async (req, res, next) => {
    try {
      const result = await orderService.searchPagination(req);
      const response = responseSuccess(result, 'Search job orders successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/thue-cong-viec/:id
  findOne: async (req, res, next) => {
    try {
      const result = await orderService.findOne(req);
      const response = responseSuccess(result, `Get job order #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/thue-cong-viec/:id
  update: async (req, res, next) => {
    try {
      const result = await orderService.update(req);
      const response = responseSuccess(result, `Update job order #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/thue-cong-viec/:id
  remove: async (req, res, next) => {
    try {
      const result = await orderService.remove(req);
      const response = responseSuccess(result, `Delete job order #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/thue-cong-viec/lay-danh-sach-da-thue
  getUserOrders: async (req, res, next) => {
    try {
      const result = await orderService.getUserOrders(req);
      const response = responseSuccess(result, 'Get user orders successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/thue-cong-viec/hoan-thanh-cong-viec/:MaThueCongViec
  completeOrder: async (req, res, next) => {
    try {
      const result = await orderService.completeOrder(req);
      const response = responseSuccess(result, `Complete order #${req.params.MaThueCongViec} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};