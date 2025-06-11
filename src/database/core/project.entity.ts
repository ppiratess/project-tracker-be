import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ProjectStatus } from 'src/enums/project-status.enums';

@Entity()
export class Project extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'uuid' })
  createdBy: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    nullable: false,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @Column({ type: 'uuid', nullable: true })
  deletedBy: string | null;
}
