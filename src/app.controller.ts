import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/roles.decorator';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('dairy-inspector')
  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  getDairyPage() {
    return 'dsfdsf';
  }
}
