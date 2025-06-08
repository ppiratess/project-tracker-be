import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ForgotPasswordDto, LoginDto } from './dto/auth.dto';
import { BaseResponseSchema } from 'src/common/schema/common.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginBody: LoginDto) {
    return this.authService.login(loginBody);
  }

  @Public()
  @Post('refresh-token')
  refreshAccessToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken({ refresh_token: refreshToken });
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<BaseResponseSchema> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}
