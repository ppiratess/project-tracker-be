import {
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ProjectStatus } from 'src/enums/project-status.enums';

export class CreateAProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string | null;

  @IsEnum(ProjectStatus)
  @IsNotEmpty()
  status: ProjectStatus;
}

export class UpdateAProjectDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string | null;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status: ProjectStatus;
}
