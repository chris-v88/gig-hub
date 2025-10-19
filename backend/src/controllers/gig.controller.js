import { gigService } from '../services/gig.service.js';
import { responseSuccess } from '../common/helpers/response.helpers.js';
import { statusCodes } from '../common/helpers/status-code.helper.js';

export const gigController = {
  create: async (req, res, next) => {
    try {
      const result = await gigService.create(req);
      const response = responseSuccess(result, 'Create gig successfully', statusCodes.CREATED);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  findAll: async (req, res, next) => {
    try {
      const result = await gigService.findAll(req);
      const response = responseSuccess(result, 'Get all gigs successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  findOne: async (req, res, next) => {
    try {
      const result = await gigService.findOne(req);
      const response = responseSuccess(result, `Get gig #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const result = await gigService.update(req);
      const response = responseSuccess(result, `Update gig #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  remove: async (req, res, next) => {
    try {
      const result = await gigService.remove(req);
      const response = responseSuccess(result, `Remove gig #${req.params.id} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  search: async (req, res, next) => {
    try {
      console.log('Search request received:', req.query);
      const result = await gigService.search(req);
      console.log('Search result:', result);
      const response = responseSuccess(result, 'Search gigs successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error('Search error in controller:', error);
      next(error);
    }
  },
};