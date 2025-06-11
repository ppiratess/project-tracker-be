import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { ProjectService } from './project.service';
import { CreateAProjectDto } from './dto/project.dto';
import { Project } from 'src/database/core/project.entity';
import { BaseResponse } from 'src/utils/base-response.util';

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
  getAProject() {
    return 'Project';
  }

  // rbac -> only manager and owner and qa can do it
  @Patch(':id')
  updateAProject() {
    return 'Updated';
  }

  // rbac -> only manager and owner can do it
  @Delete(':id')
  deleteAProject() {
    return 'Deleted';
  }
}
