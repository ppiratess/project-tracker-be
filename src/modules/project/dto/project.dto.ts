import {
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  IsUUID,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { UserRole } from 'src/enums/user-role.enums';
import { Project } from 'src/database/core/project.entity';
import { RequestQueryDto } from 'src/common/dto/common.dto';
import { ProjectStatus } from 'src/enums/project-status.enums';
import { ProjectMembers } from 'src/database/core/project-members.entity';

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

export class GetAllProjectQueryDto extends RequestQueryDto {
  @IsOptional()
  @IsArray()
  @IsEnum(ProjectStatus, { each: true })
  @Transform(({ value }: { value: ProjectStatus }) =>
    Array.isArray(value) ? value : [value],
  )
  @Type(() => String)
  status?: ProjectStatus[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }: { value: string }) =>
    Array.isArray(value) ? value : [value],
  )
  @Type(() => String)
  createdBy?: string;
}

export class AssignMemberDto {
  @IsUUID()
  userId: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class AssignMembersDto {
  @ValidateNested({ each: true })
  @Type(() => AssignMemberDto)
  @IsArray()
  assignments: AssignMemberDto[];
}

export class SingleProjectResponse {
  project: Project;
  projectMembers: ProjectMembers[];
}

export class UpdateProjectStatusDto {
  @IsUUID()
  userId: string;

  @IsBoolean()
  isActive: boolean;
}
