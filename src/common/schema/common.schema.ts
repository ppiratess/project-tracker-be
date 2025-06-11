import { UserRole } from 'src/enums/user-role.enums';

export interface BaseResponseSchema {
  message: string;
}

export interface UserDetailsFromToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
  role: UserRole;
}
