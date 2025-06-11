import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';

import { ProjectService } from './project.service';
import { CreateAProjectDto } from './dto/project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // rbac -> only manager and owner can do it
  @Post()
  createAProject(@Body() createAProjectDto: CreateAProjectDto): Promise<any> {
    return this.projectService.createProject(createAProjectDto);
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
