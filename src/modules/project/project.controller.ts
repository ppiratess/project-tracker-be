import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { ProjectService } from './project.service';
import { UserRole } from 'src/enums/user-role.enums';
import { Project } from 'src/database/core/project.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResponse } from 'src/utils/base-response.util';
import { RequestQueryDto } from 'src/common/dto/common.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { CreateAProjectDto, UpdateAProjectDto } from './dto/project.dto';

@UseGuards(RolesGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @Post()
  createAProject(
    @Req() request: Request,
    @Body() createAProjectDto: CreateAProjectDto,
  ): Promise<BaseResponse<Project>> {
    return this.projectService.createProject(request, createAProjectDto);
  }

  @Get(':id')
  getAProject(@Param('id') id: string): Promise<BaseResponse<Project>> {
    return this.projectService.getProjectById(id);
  }

  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.QA)
  @Put(':id')
  updateAProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateAProjectDto,
  ): Promise<BaseResponse<Project>> {
    return this.projectService.updateProject(id, updateProjectDto);
  }

  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @Delete(':id')
  deleteAProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }

  @Get()
  getAllProject(
    @Query() query: RequestQueryDto,
  ): Promise<BaseResponse<Project[]>> {
    return this.projectService.getAllProject(query);
  }
}
