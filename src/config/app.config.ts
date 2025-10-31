import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '7010', 10),
  name: process.env.APP_NAME || 'P2A Research',
  url: process.env.APP_URL || 'http://localhost:7010',
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
  timezone: 'UTC',
}));


