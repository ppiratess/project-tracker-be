import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtUtils } from 'src/utils/jwt.utils';
import { ProjectService } from './project.service';
import { User } from 'src/database/core/user.entity';
import { ProjectController } from './project.controller';
import { Project } from 'src/database/core/project.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RbacService } from 'src/common/service/rbac.service';
import { ProjectTasks } from 'src/database/core/project-tasks.entity';
import { ProjectMembers } from 'src/database/core/project-members.entity';
import { ProjectTaskMembers } from 'src/database/core/project-task-members.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectMembers,
      ProjectTasks,
      ProjectTaskMembers,
      User,
    ]),
  ],
  providers: [
    ProjectService,
    JwtUtils,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    RbacService,
  ],
  controllers: [ProjectController],
  exports: [JwtUtils, RbacService],
})
export class ProjectModule {}
