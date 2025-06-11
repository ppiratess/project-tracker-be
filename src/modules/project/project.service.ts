import { Request } from 'express';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtUtils } from 'src/utils/jwt.utils';
import { CreateAProjectDto } from './dto/project.dto';
import { Project } from 'src/database/core/project.entity';

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
  ): Promise<any> {
    try {
      const decodedUserData = this.jwtUtils.getUserFromRequest(request);

      const createAProjectData = {
        ...createProjectDto,
        createdBy: decodedUserData.userId,
      };
      return this.projectRepository.save(createAProjectData);
    } catch (error) {
      console.log('error', error);
      return error;
    }
  }
}
