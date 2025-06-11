import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtUtils } from 'src/utils/jwt.utils';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from 'src/database/core/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [ProjectService, JwtUtils],
  controllers: [ProjectController],
  exports: [JwtUtils],
})
export class ProjectModule {}
