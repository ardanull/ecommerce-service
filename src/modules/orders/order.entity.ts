import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { OrderItem } from './orderItem.entity';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'varchar', default: 'PENDING' })
  status!: OrderStatus;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items!: OrderItem[];

  @CreateDateColumn()
  createdAt!: Date;
}
