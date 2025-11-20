import { IsNumber, IsPositive, IsString, MinLength, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(5)
  description!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNumber()
  stock!: number;

  @IsUUID()
  categoryId!: string;
}
