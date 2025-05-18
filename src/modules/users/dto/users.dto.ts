import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/enums/user-role.enums';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(3)
  userName: string;

  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class UserResponseDto {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
