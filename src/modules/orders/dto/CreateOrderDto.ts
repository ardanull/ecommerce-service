import { ArrayNotEmpty, IsArray, IsInt, IsUUID, Min } from 'class-validator';

export class OrderItemInput {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  items!: OrderItemInput[];
}
