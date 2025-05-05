import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProjectStatus } from 'src/enums/project-status.enums';

@Entity()
export class Project extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    nullable: false,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;
}
