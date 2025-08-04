import { Entity, ManyToOne } from 'typeorm';

import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import { ProjectTasks } from './project-tasks.entity';

@Entity()
export class ProjectTaskMembers extends BaseEntity {
  @ManyToOne(() => ProjectTasks, (task) => task.members, {
    onDelete: 'CASCADE',
  })
  task: ProjectTasks;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;
}
