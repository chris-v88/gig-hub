import { responseSuccess } from '../common/helpers/response.helpers.js';
import { skillService } from '../services/skill.service.js';

export const skillController = {
  // GET /api/skill
  findAll: async (req, res) => {
    try {
      const skills = await skillService.findAll(req);
      res.status(200).json(responseSuccess(skills, 'Skills retrieved successfully'));
    } catch (error) {
      res.status(error.code || 500).json({
        message: error.message,
        content: error.content || 'Internal server error',
      });
    }
  },

  // POST /api/skill
  create: async (req, res) => {
    try {
      const skill = await skillService.create(req);
      res.status(201).json(responseSuccess(skill, 'Skill created successfully'));
    } catch (error) {
      res.status(error.code || 500).json({
        message: error.message,
        content: error.content || 'Internal server error',
      });
    }
  },

  // GET /api/skill/phan-trang-tim-kiem
  searchPagination: async (req, res) => {
    try {
      const result = await skillService.searchPagination(req);
      res.status(200).json(responseSuccess(result, 'Skills retrieved with pagination'));
    } catch (error) {
      res.status(error.code || 500).json({
        message: error.message,
        content: error.content || 'Internal server error',
      });
    }
  },

  // GET /api/skill/:id
  findOne: async (req, res) => {
    try {
      const skill = await skillService.findOne(req);
      res.status(200).json(responseSuccess(skill, 'Skill retrieved successfully'));
    } catch (error) {
      res.status(error.code || 500).json({
        message: error.message,
        content: error.content || 'Internal server error',
      });
    }
  },

  // PUT /api/skill/:id
  update: async (req, res) => {
    try {
      const skill = await skillService.update(req);
      res.status(200).json(responseSuccess(skill, 'Skill updated successfully'));
    } catch (error) {
      res.status(error.code || 500).json({
        message: error.message,
        content: error.content || 'Internal server error',
      });
    }
  },

  // DELETE /api/skill/:id
  remove: async (req, res) => {
    try {
      const result = await skillService.remove(req);
      res.status(200).json(responseSuccess(result, 'Skill deleted successfully'));
    } catch (error) {
      res.status(error.code || 500).json({
        message: error.message,
        content: error.content || 'Internal server error',
      });
    }
  },
};