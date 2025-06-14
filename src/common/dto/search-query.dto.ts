import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SearchQueryDto {
  @IsOptional()
  @Type(() => String)
  @IsString()
  search?: string;
}
