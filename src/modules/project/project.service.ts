import { Request } from 'express';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtUtils } from 'src/utils/jwt.utils';
import { Project } from 'src/database/core/project.entity';
import { CreateAProjectDto, UpdateAProjectDto } from './dto/project.dto';
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
        return createResponse(409, `Project ${name} already exists.`);
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

  async getProjectById(projectId: string): Promise<BaseResponse<Project>> {
    try {
      const project = await this.projectRepository.findOne({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        return createResponse(404, 'Requested project could not be found');
      }

      return createResponse(200, 'Project retrieved successfully', project);
    } catch (error) {
      return createResponse(500, 'Failed to get project details', error);
    }
  }

  async updateProject(
    projectId: string,
    updates: UpdateAProjectDto,
  ): Promise<BaseResponse<Project>> {
    try {
      const project = await this.projectRepository.findOneBy({ id: projectId });

      if (!project) {
        return createResponse(404, 'Requested project could not be found');
      }

      Object.assign(project, updates);

      const updatedProject = await this.projectRepository.save(project);

      return createResponse(
        200,
        'Project updated successfully',
        updatedProject,
      );
    } catch (error) {
      return createResponse(500, 'Failed to update project', error);
    }
  }

  async deleteProject(projectId: string): Promise<BaseResponse> {
    try {
      await this.projectRepository.delete({ id: projectId });

      return createResponse(201, 'Project deleted successfully');
    } catch (error) {
      return createResponse(500, 'Failed to update project', error);
    }
  }

  async getAllProject() {
    try {
      const projects = await this.projectRepository.find({});

      return createResponse(200, 'Projets fetched successfully.', projects);
    } catch (error) {
      return createResponse(500, 'Failed to get project', error);
    }
  }
}
