import { Request } from 'express';
import { In, Repository } from 'typeorm';
import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  AssignMembersDto,
  CreateAProjectDto,
  GetAllProjectQueryDto,
  SingleProjectResponse,
  UpdateAProjectDto,
  UpdateProjectStatusDto,
} from './dto/project.dto';
import { validateUserIds } from './helpers';
import { JwtUtils } from 'src/utils/jwt.utils';
import { User } from 'src/database/core/user.entity';
import { CreateTaskDto } from './dto/project-task.dto';
import { Project } from 'src/database/core/project.entity';
import { RbacService } from 'src/common/service/rbac.service';
import { ProjectTaskStatus } from 'src/enums/project-status.enums';
import { ProjectTasks } from 'src/database/core/project-tasks.entity';
import { ProjectMembers } from 'src/database/core/project-members.entity';
import { BaseResponse, createResponse } from 'src/utils/base-response.util';
import { ProjectTaskMembers } from 'src/database/core/project-task-members.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly jwtUtils: JwtUtils,
    @InjectRepository(ProjectMembers)
    private readonly projectMemberRepository: Repository<ProjectMembers>,
    private readonly rbacService: RbacService,
    @InjectRepository(ProjectTasks)
    private readonly projectTaskRepository: Repository<ProjectTasks>,
    @InjectRepository(ProjectTaskMembers)
    private readonly projectTaskMembersRepository: Repository<ProjectTaskMembers>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async getProjectById(
    projectId: string,
  ): Promise<BaseResponse<SingleProjectResponse>> {
    try {
      const project = await this.projectRepository.findOne({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        return createResponse(404, 'Requested project could not be found');
      }

      const projectMembers = await this.projectMemberRepository.find({
        where: { projectId },
      });

      const response = {
        project,
        projectMembers,
      };

      return createResponse(200, 'Project retrieved successfully', response);
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

      return createResponse(200, 'Project deleted successfully');
    } catch (error) {
      return createResponse(500, 'Failed to update project', error);
    }
  }

  async getAllProject(
    @Query() query: GetAllProjectQueryDto,
  ): Promise<BaseResponse<Project[]>> {
    try {
      const { page = 1, perPage = 10, search, status, createdBy } = query;

      const queryBuilder = this.projectRepository.createQueryBuilder('project');

      if (search) {
        queryBuilder.where(
          'project.name ILIKE :search OR project.description ILIKE :search',
          { search: `%${search}%` },
        );
      }

      if (status && status.length > 0) {
        if (search) {
          queryBuilder.andWhere('project.status IN (:...status)', { status });
        } else {
          queryBuilder.where('project.status IN (:...status)', { status });
        }
      }

      if (createdBy && createdBy.length > 0) {
        if (search) {
          queryBuilder.andWhere('project.createdBy IN (:...createdBy)', {
            createdBy,
          });
        } else {
          queryBuilder.where('project.createdBy IN (:...createdBy)', {
            createdBy,
          });
        }
      }

      queryBuilder
        .skip((page - 1) * perPage)
        .take(perPage)
        .orderBy('project.createdAt', 'DESC');

      const [projects, total] = await queryBuilder.getManyAndCount();

      const paginationBody = {
        total,
        page,
        perPage,
      };

      const responseMessage =
        projects.length === 0
          ? 'No projects found'
          : 'Projects fetched successfully.';

      return createResponse(200, responseMessage, projects, paginationBody);
    } catch (error) {
      return createResponse(500, 'Failed to get project', error);
    }
  }

  async assignUserToProject(
    projectId: string,
    assignMembersDto: AssignMembersDto,
  ) {
    try {
      const projectDetails = await this.getProjectById(projectId);

      if (projectDetails.status !== 200) {
        return createResponse(404, projectDetails?.message);
      }
      const assignments = assignMembersDto.assignments;

      const userIds = assignments.map((assignment) => assignment.userId);

      const existingMembers = await this.projectMemberRepository.find({
        where: {
          projectId,
          userId: In(userIds),
        },
      });

      const existingMap = new Map(
        existingMembers.map((user) => [user.userId, user]),
      );

      const membersToSave = assignments.map((assignment) => {
        const existing = existingMap.get(assignment.userId);

        if (existing) {
          existing.role = assignment.role;
          existing.isActive = true;
          return existing;
        } else {
          const newMember = new ProjectMembers();
          newMember.projectId = projectId;
          newMember.userId = assignment.userId;
          newMember.role = assignment.role;
          newMember.isActive = true;
          return newMember;
        }
      });

      await this.projectMemberRepository.save(membersToSave);

      return createResponse(200, 'Project members assigned successfully');
    } catch {
      return createResponse(500, 'Failed to assign members to project');
    }
  }

  async updateProjectMemberStatus(
    projectId: string,
    request: Request,
    body: UpdateProjectStatusDto,
  ) {
    try {
      const { userId, isActive } = body;

      const requestUser = this.jwtUtils.getUserFromRequest(request);

      const member: ProjectMembers | null =
        await this.projectMemberRepository.findOne({
          where: { userId, projectId },
        });

      if (!member) {
        return createResponse(404, 'User does not exist in project');
      }

      const canRequestUserManageRole = this.rbacService.canManageRole(
        requestUser.role,
        member.role,
      );

      if (!canRequestUserManageRole) {
        return createResponse(403, 'You do not have enough permission');
      }

      member.isActive = isActive;
      await this.projectMemberRepository.save(member);

      return createResponse(200, 'Member status updated successfully', member);
    } catch (error) {
      return createResponse(500, 'Failed to update project member', error);
    }
  }

  async createProjectTask(
    projectId: string,
    request: Request,
    createTaskDto: CreateTaskDto,
  ) {
    try {
      const {
        name,
        description,
        startDate,
        endDate,
        status = ProjectTaskStatus.TODO,
        assignedUserIds,
      } = createTaskDto;

      const project = await this.projectRepository.findOneBy({ id: projectId });

      if (!project) {
        return createResponse(404, 'Project not found');
      }

      const missingUserIds = await validateUserIds(
        assignedUserIds,
        this.userRepository,
      );

      if (missingUserIds.length > 0) {
        return createResponse(
          400,
          `These user ${missingUserIds.length === 1 ? 'ID' : 'IDs'} ${missingUserIds.length === 1 ? 'does' : 'do'} not exist in the project : ${missingUserIds.join(', ')}`,
        );
      }

      const requestUser = this.jwtUtils.getUserFromRequest(request);

      const task = this.projectTaskRepository.create({
        name,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status,
        createdBy: requestUser.userId,
        project,
        projectId,
      });

      await this.projectTaskRepository.save(task);

      const memberEntities = assignedUserIds.map((userId) =>
        this.projectTaskMembersRepository.create({
          user: { id: userId },
          task,
        }),
      );

      await this.projectTaskMembersRepository.save(memberEntities);

      return createResponse(200, 'Task created successfully', task);
    } catch (error) {
      return createResponse(500, 'Failed to create project task', error);
    }
  }
}
