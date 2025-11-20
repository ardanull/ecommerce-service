import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './dto/CreateProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';

interface ProductFilter {
  page: number;
  limit: number;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  search?: string;
}

export class ProductsService {
  private repo: Repository<Product>;
  private categoryRepo: Repository<Category>;

  constructor() {
    this.repo = AppDataSource.getRepository(Product);
    this.categoryRepo = AppDataSource.getRepository(Category);
  }

  async findAll(filter: ProductFilter) {
    const { page, limit, minPrice, maxPrice, categoryId, search } = filter;
    const qb = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (typeof minPrice === 'number') {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (typeof maxPrice === 'number') {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }
    if (search) {
      qb.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', {
        search: `%${search}%`
      });
    }

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      total,
      page,
      limit
    };
  }

  async findById(id: string): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
    if (!category) {
      const err: any = new Error('Category not found');
      err.status = 400;
      throw err;
    }

    const product = this.repo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      category
    });

    return this.repo.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findById(id);
    if (!product) {
      const err: any = new Error('Product not found');
      err.status = 404;
      throw err;
    }

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) {
        const err: any = new Error('Category not found');
        err.status = 400;
        throw err;
      }
      (product as any).category = category;
    }

    Object.assign(product, {
      name: dto.name ?? product.name,
      description: dto.description ?? product.description,
      price: dto.price ?? product.price,
      stock: dto.stock ?? product.stock
    });

    return this.repo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findById(id);
    if (!product) {
      const err: any = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    await this.repo.remove(product);
  }
}
