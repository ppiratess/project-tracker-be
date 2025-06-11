import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';

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
