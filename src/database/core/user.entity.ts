import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from 'src/enums/user-role.enums';

@Entity()
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
  })
  role: UserRole;
}
