import { Request } from 'express';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtUtils } from 'src/utils/jwt.utils';
import { CreateAProjectDto } from './dto/project.dto';
import { Project } from 'src/database/core/project.entity';
import { BaseResponse, createResponse } from 'src/utils/base-response.util';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly jwtUtils: JwtUtils,
  ) {}

  async createProject(
    request: Request,
    createProjectDto: CreateAProjectDto,
  ): Promise<BaseResponse<Project>> {
    try {
      const { name } = createProjectDto;

      const decodedUserData = this.jwtUtils.getUserFromRequest(request);

      const existingProject = await this.projectRepository.findOne({
        where: {
          name,
        },
      });

      if (existingProject) {
        return createResponse(409, `Project with ${name} already exists.`);
      }

      const createAProjectData = {
        ...createProjectDto,
        createdBy: decodedUserData.userId,
      };

      const savedProject =
        await this.projectRepository.save(createAProjectData);

      return createResponse(201, 'Project created successfully', savedProject);
    } catch (error) {
      return createResponse(500, 'Failed to create project', error);
    }
  }
}
