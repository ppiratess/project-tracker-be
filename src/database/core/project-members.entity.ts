import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';

import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import { Project } from './project.entity';
import { UserRole } from 'src/enums/user-role.enums';

@Index(['projectId', 'userId'], { unique: true })
@Entity()
export class ProjectMembers extends BaseEntity {
  @Column()
  projectId: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
