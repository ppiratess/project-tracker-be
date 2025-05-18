import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';
import { HashUtil } from 'src/utls/hash.utils';
import { UserResponseDto } from '../users/dto/users.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  async login(request: LoginDto) {
    const { email, password } = request;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await HashUtil.comparePassword(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return instanceToPlain(user) as UserResponseDto;
  }
}
