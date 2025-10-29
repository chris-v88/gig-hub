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
      const response = responseSuccess(result, 'Search gigs successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  createReview: async (req, res, next) => {
    try {
      const result = await gigService.createReview(req);
      const response = responseSuccess(result, `Review created successfully for gig #${req.params.id}`, statusCodes.CREATED);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/cong-viec/phan-trang-tim-kiem
  searchPagination: async (req, res, next) => {
    try {
      const result = await gigService.searchPagination(req);
      const response = responseSuccess(result, 'Search gigs with pagination successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/cong-viec/upload-hinh-cong-viec/:MaCongViec
  uploadGigImage: async (req, res, next) => {
    try {
      const result = await gigService.uploadGigImage(req);
      const response = responseSuccess(result, 'Upload gig image successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/cong-viec/lay-menu-loai-cong-viec
  getJobTypeMenu: async (req, res, next) => {
    try {
      const result = await gigService.getJobTypeMenu(req);
      const response = responseSuccess(result, 'Get job type menu successfully', statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/cong-viec/lay-chi-tiet-loai-cong-viec/:MaLoaiCongViec
  getJobTypeDetails: async (req, res, next) => {
    try {
      const result = await gigService.getJobTypeDetails(req);
      const response = responseSuccess(result, `Get job type details for #${req.params.MaLoaiCongViec} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/cong-viec/lay-cong-viec-theo-chi-tiet-loai/:MaChiTietLoai
  getGigsBySubcategory: async (req, res, next) => {
    try {
      const result = await gigService.getGigsBySubcategory(req);
      const response = responseSuccess(result, `Get gigs by subcategory #${req.params.MaChiTietLoai} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/cong-viec/lay-cong-viec-chi-tiet/:MaCongViec
  getGigDetails: async (req, res, next) => {
    try {
      const result = await gigService.getGigDetails(req);
      const response = responseSuccess(result, `Get gig details #${req.params.MaCongViec} successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/cong-viec/lay-danh-sach-cong-viec-theo-ten/:TenCongViec
  getGigsByName: async (req, res, next) => {
    try {
      const result = await gigService.getGigsByName(req);
      const response = responseSuccess(result, `Get gigs by name "${req.params.TenCongViec}" successfully`, statusCodes.OK);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};