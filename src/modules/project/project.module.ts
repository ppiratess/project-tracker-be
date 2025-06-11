import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtUtils } from 'src/utils/jwt.utils';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from 'src/database/core/project.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [
    ProjectService,
    JwtUtils,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [ProjectController],
  exports: [JwtUtils],
})
export class ProjectModule {}
