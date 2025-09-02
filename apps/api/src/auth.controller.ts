import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name?: string }) {
    try {
      return await this.authService.register(body);
    } catch (e: any) {
      throw new HttpException(e.message || 'Registration failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const token = await this.authService.login(body.email, body.password);
    if (!token) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return { access_token: token };
  }
}
