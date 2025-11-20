import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Order } from './order.entity';
import { OrderItem } from './orderItem.entity';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { Product } from '../products/product.entity';

export class OrdersService {
  private orderRepo: Repository<Order>;
  private orderItemRepo: Repository<OrderItem>;
  private productRepo: Repository<Product>;

  constructor() {
    this.orderRepo = AppDataSource.getRepository(Order);
    this.orderItemRepo = AppDataSource.getRepository(OrderItem);
    this.productRepo = AppDataSource.getRepository(Product);
  }

  async create(userId: string, dto: CreateOrderDto): Promise<Order> {
    if (!dto.items || dto.items.length === 0) {
      const err: any = new Error('Order items cannot be empty');
      err.status = 400;
      throw err;
    }

    const productIds = dto.items.map((i) => i.productId);
    const products = await this.productRepo.findByIds(productIds as any);
    if (products.length !== productIds.length) {
      const err: any = new Error('One or more products not found');
      err.status = 400;
      throw err;
    }

    // stok ve toplam hesapla
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      if (product.stock < item.quantity) {
        const err: any = new Error(`Insufficient stock for product ${product.name}`);
        err.status = 400;
        throw err;
      }

      const unitPrice = Number(product.price);
      totalAmount += unitPrice * item.quantity;

      const orderItem = this.orderItemRepo.create({
        product,
        quantity: item.quantity,
        unitPrice
      });
      orderItems.push(orderItem);

      // stok düş
      product.stock = product.stock - item.quantity;
    }

    await this.productRepo.save(products);

    const order = this.orderRepo.create({
      userId,
      totalAmount,
      status: 'PENDING',
      items: orderItems
    });

    return this.orderRepo.save(order);
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderRepo.findOne({ where: { id } });
  }
}
