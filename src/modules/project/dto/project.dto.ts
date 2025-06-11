import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ProjectStatus } from 'src/enums/project-status.enums';

export class CreateAProjectDto {
  @IsString()
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
  status: ProjectStatus;
}
