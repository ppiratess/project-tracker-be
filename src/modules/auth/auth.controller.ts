import { Controller, Post, Body } from '@nestjs/common';

import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginBody: LoginDto) {
    return this.authService.login(loginBody);
  }
}
