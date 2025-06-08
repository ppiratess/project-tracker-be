import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import {
  AuthResponseDto,
  JwtPayload,
  LoginDto,
  RefreshTokenDto,
} from './dto/auth.dto';
import { HashUtil } from 'src/utils/hash.utils';
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

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '60s',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
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

      const user = await this.userService.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { sub: user.id, email: user.email };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '60s',
      });

      const refreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '7d',
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
}
