import { Controller, Post, Body } from '@nestjs/common';

import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginBody: LoginDto) {
    return this.authService.login(loginBody);
  }
}
