import { IsString, IsOptional } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  categoryId: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  description?: string;
}
