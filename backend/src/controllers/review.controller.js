import { reviewService } from '../services/review.service.js';
import { responseSuccess } from '../common/helpers/response.helpers.js';
import { statusCodes } from '../common/helpers/status-code.helper.js';

export const reviewController = {
  // GET /api/binh-luan
  findAll: async (req, res, next) => {
    try {
      const result = await reviewService.findAll(req);
      const response = responseSuccess(result, 'Get all reviews successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/binh-luan
  create: async (req, res, next) => {
    try {
      const result = await reviewService.create(req);
      const response = responseSuccess(result, 'Create review successfully', statusCodes.CREATED);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/binh-luan/:id
  update: async (req, res, next) => {
    try {
      const result = await reviewService.update(req);
      const response = responseSuccess(result, `Update review #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/binh-luan/:id
  remove: async (req, res, next) => {
    try {
      const result = await reviewService.remove(req);
      const response = responseSuccess(result, `Delete review #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/binh-luan/lay-binh-luan-theo-cong-viec/:MaCongViec
  getByGig: async (req, res, next) => {
    try {
      const result = await reviewService.getByGig(req);
      const response = responseSuccess(result, `Get reviews for gig #${req.params.MaCongViec} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};