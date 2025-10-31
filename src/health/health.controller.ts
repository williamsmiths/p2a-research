import { Controller, Get } from '@nestjs/common';
import { Public } from '@common';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return {
      service: 'p2a-research',
      uptime: process.uptime(),
    };
  }
}


