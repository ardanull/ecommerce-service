import { Router } from 'express';
import { OrdersService } from './orders.service';
import { validateRequest } from '../../middleware/validateRequest';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { authMiddleware, AuthRequest, requireRole } from '../../middleware/authMiddleware';

export const ordersRouter = Router();
const ordersService = new OrdersService();

// Kullanıcının kendi siparişleri
ordersRouter.get('/me', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const orders = await ordersService.findByUser(req.user!.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Admin için tüm siparişler
ordersRouter.get('/', authMiddleware, requireRole('ADMIN'), async (_req, res, next) => {
  try {
    const orders = await ordersService.findAll();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Sipariş oluşturma
ordersRouter.post(
  '/',
  authMiddleware,
  validateRequest(CreateOrderDto),
  async (req: AuthRequest, res, next) => {
    try {
      const order = await ordersService.create(req.user!.id, req.body);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }
);

// Tekil sipariş (owner veya admin kontrolü burada basit tutuldu)
ordersRouter.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const order = await ordersService.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});
