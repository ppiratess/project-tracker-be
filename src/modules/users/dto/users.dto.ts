import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
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

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  userName?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
