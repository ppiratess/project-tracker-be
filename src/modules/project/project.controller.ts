import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { ProjectService } from './project.service';
import { Project } from 'src/database/core/project.entity';
import { BaseResponse } from 'src/utils/base-response.util';
import { CreateAProjectDto, UpdateAProjectDto } from './dto/project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // rbac -> only manager and owner can do it
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

  // rbac -> only manager and owner and qa can do it
  @Put(':id')
  updateAProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateAProjectDto,
  ): Promise<BaseResponse<Project>> {
    return this.projectService.updateProject(id, updateProjectDto);
  }

  // rbac -> only manager and owner can do it
  @Delete(':id')
  deleteAProject() {
    return 'Deleted';
  }
}
