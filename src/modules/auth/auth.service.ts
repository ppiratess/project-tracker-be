import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';

import {
  AuthResponseDto,
  ForgotPasswordDto,
  JwtPayload,
  LoginDto,
  RefreshTokenDto,
} from './dto/auth.dto';
import { HashUtil } from 'src/utils/hash.utils';
import { JWT_CONFIG } from 'src/config/app.config';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(request: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = request;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await HashUtil.comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
    });

    const plainUserObject = instanceToPlain(user);

    return {
      ...(plainUserObject as UserResponseDto),
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(request: RefreshTokenDto): Promise<AuthResponseDto> {
    const { refresh_token } = request;

    try {
      const payload: JwtPayload =
        await this.jwtService.verifyAsync(refresh_token);

      const userResponse = await this.userService.findById(payload.id);

      const user = userResponse?.data;

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { userId: user.id, email: user.email };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
      });

      const refreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
      });

      const plainUserObject = instanceToPlain(user);

      return {
        ...(plainUserObject as UserResponseDto),
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(`Token verification failed: ${error}`);
    }
  }

  async forgotPassword(
    request: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { userId, password } = request;

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await HashUtil.hashPassword(password);

    try {
      await this.userService.updateUser(userId, {
        password: hashedPassword,
      });

      return { message: 'Password reset successfully' };
    } catch {
      throw new InternalServerErrorException('Failed to reset password');
    }
  }
}
