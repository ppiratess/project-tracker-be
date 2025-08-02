import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import { Project } from './project.entity';
import { ProjectTaskStatus } from 'src/enums/project-status.enums';

@Entity()
export class ProjectTasks extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'uuid' })
  createdBy: string;

  @Column()
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null;

  @Column({
    type: 'enum',
    enum: ProjectTaskStatus,
    nullable: false,
    default: ProjectTaskStatus.TODO,
  })
  status: ProjectTaskStatus;

  @ManyToMany(() => User, { eager: false })
  @JoinTable()
  members: User[];

  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  project: Project;
}
