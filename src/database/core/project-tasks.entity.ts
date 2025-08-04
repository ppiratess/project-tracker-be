import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Project } from './project.entity';
import { ProjectTaskStatus } from 'src/enums/project-status.enums';
import { ProjectTaskMembers } from './project-task-members.entity';

@Entity()
export class ProjectTasks extends BaseEntity {
  @Column({ type: 'uuid' })
  projectId: string;

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

  @OneToMany(() => ProjectTaskMembers, (member) => member.task, {
    cascade: true,
  })
  members: ProjectTaskMembers[];

  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  project: Project;
}
