import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { HashUtil } from 'src/utils/hash.utils';
import { UsersService } from '../users/users.service';
import { AuthResponseDto, LoginDto } from './dto/auth.dto';
import { UserResponseDto } from '../users/dto/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
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

    const plainUserObject = instanceToPlain(user);

    return {
      ...(plainUserObject as UserResponseDto),
      access_token: await this.jwtService.signAsync(plainUserObject),
    };
  }
}
