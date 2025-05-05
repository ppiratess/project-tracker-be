import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class ProjectMembers extends BaseEntity {
  @Column()
  projectId: string;

  @Column()
  userId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;
}
