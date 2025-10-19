import express from 'express';
import { gigController } from '../controllers/gig.controller.js';

const gigRouter = express.Router();

// Create route CRUD
gigRouter.post('/', gigController.create);
gigRouter.get('/', gigController.findAll);
gigRouter.get('/search', gigController.search);
gigRouter.get('/:id', gigController.findOne);
gigRouter.patch('/:id', gigController.update);
gigRouter.delete('/:id', gigController.remove);

export default gigRouter;