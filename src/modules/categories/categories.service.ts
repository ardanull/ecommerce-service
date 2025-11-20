import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto';

export class CategoriesService {
  private repo: Repository<Category>;

  constructor() {
    this.repo = AppDataSource.getRepository(Category);
  }

  async findAll(): Promise<Category[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Category | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.repo.findOne({ where: { name: dto.name } });
    if (existing) {
      const err: any = new Error('Category name already exists');
      err.status = 400;
      throw err;
    }

    const category = this.repo.create(dto);
    return this.repo.save(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(id);
    if (!category) {
      const err: any = new Error('Category not found');
      err.status = 404;
      throw err;
    }

    Object.assign(category, dto);
    return this.repo.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findById(id);
    if (!category) {
      const err: any = new Error('Category not found');
      err.status = 404;
      throw err;
    }
    await this.repo.remove(category);
  }
}
