import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { DecodedFirebaseToken } from './types/token-user.types';
import { AdminAuthGuard } from './guards/admin-auth/admin-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RefreshAuthGuard)
  @Get('login')
  login(@Request() req: { user: DecodedFirebaseToken }) {
    return `Hello, this is the login endpoint that is protected for user ${req.user.name}`;
  }
  @UseGuards(AdminAuthGuard)
  @Get('test')
  test(@Request() req: { user: DecodedFirebaseToken }) {
    return {
      message: `Hello, this is the test endpoint that is protected for user ${req.user.name}`,
    };
  }

  @Get('public')
  publicEndpoint() {
    return { message: 'Hello, this is a public endpoint' };
  }
}
