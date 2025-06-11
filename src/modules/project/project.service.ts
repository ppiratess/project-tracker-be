import { Injectable } from '@nestjs/common';
import { CreateAProjectDto } from './dto/project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/database/core/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async createProject(createProjectDto: CreateAProjectDto): Promise<any> {
    try {
      return this.projectRepository.save(createProjectDto);
    } catch (error) {
      console.log('error', error);
      return error;
    }
  }
}
