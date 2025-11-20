import { Router } from 'express';
import { ProductsService } from './products.service';
import { validateRequest } from '../../middleware/validateRequest';
import { CreateProductDto } from './dto/CreateProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { authMiddleware, requireRole } from '../../middleware/authMiddleware';

export const productsRouter = Router();
const productsService = new ProductsService();

productsRouter.get('/', async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const categoryId = req.query.categoryId ? String(req.query.categoryId) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;

    const result = await productsService.findAll({
      page,
      limit,
      minPrice,
      maxPrice,
      categoryId,
      search
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

productsRouter.get('/:id', async (req, res, next) => {
  try {
    const product = await productsService.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

productsRouter.post(
  '/',
  authMiddleware,
  requireRole('ADMIN'),
  validateRequest(CreateProductDto),
  async (req, res, next) => {
    try {
      const product = await productsService.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
);

productsRouter.patch(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  validateRequest(UpdateProductDto),
  async (req, res, next) => {
    try {
      const product = await productsService.update(req.params.id, req.body);
      res.json(product);
    } catch (err) {
      next(err);
    }
  }
);

productsRouter.delete(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  async (req, res, next) => {
    try {
      await productsService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);
