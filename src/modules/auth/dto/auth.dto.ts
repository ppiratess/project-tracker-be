import { IsEmail, IsString, IsUUID } from 'class-validator';

import { UserResponseDto } from 'src/modules/users/dto/users.dto';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export interface AuthResponseDto extends UserResponseDto {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload extends UserResponseDto {
  iat: number;
  exp: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type RefreshTokenDto = Pick<AuthResponseDto, 'refresh_token'>;

export class ForgotPasswordDto {
  @IsUUID()
  userId: string;

  @IsString()
  password: string;
}
