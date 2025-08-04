import {
  IsUUID,
  IsArray,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator';

import { ProjectTaskStatus } from 'src/enums/project-status.enums';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(ProjectTaskStatus)
  status?: ProjectTaskStatus;

  @IsArray()
  @IsUUID('all', { each: true })
  assignedUserIds: string[];
}
