import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() { return { ok: true, ts: new Date().toISOString() }; }

  @Get('hello')
  hello() { return this.appService.getHello(); }

  @Get('users')
  async users() { return this.appService.getUsers(); }
}
