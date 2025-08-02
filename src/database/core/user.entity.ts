import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from './base.entity';
import { UserRole } from 'src/enums/user-role.enums';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  userName: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @Column({ nullable: true })
  avatar?: string;
}
