import { Router } from 'express';
import { CategoriesService } from './categories.service';
import { validateRequest } from '../../middleware/validateRequest';
import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto';
import { authMiddleware, requireRole } from '../../middleware/authMiddleware';

export const categoriesRouter = Router();
const categoriesService = new CategoriesService();

categoriesRouter.get('/', async (_req, res, next) => {
  try {
    const categories = await categoriesService.findAll();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

categoriesRouter.get('/:id', async (req, res, next) => {
  try {
    const category = await categoriesService.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
});

categoriesRouter.post(
  '/',
  authMiddleware,
  requireRole('ADMIN'),
  validateRequest(CreateCategoryDto),
  async (req, res, next) => {
    try {
      const category = await categoriesService.create(req.body);
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
);

categoriesRouter.patch(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  validateRequest(UpdateCategoryDto),
  async (req, res, next) => {
    try {
      const category = await categoriesService.update(req.params.id, req.body);
      res.json(category);
    } catch (err) {
      next(err);
    }
  }
);

categoriesRouter.delete(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  async (req, res, next) => {
    try {
      await categoriesService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);
