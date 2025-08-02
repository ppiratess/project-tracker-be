import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity()
export class ProjectAudits extends BaseEntity {
  @Column()
  projectId: string;

  @Column()
  userId: string;

  @Column()
  action: string;

  @Column({ type: 'json', nullable: true })
  oldValue: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  newValue: Record<string, any>;
}
