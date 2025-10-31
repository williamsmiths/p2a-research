import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';
import { BusinessException } from '@common';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 7010;

  // Database Master
  @IsString()
  @IsOptional()
  DB_MASTER_HOST?: string;

  @IsNumber()
  @IsOptional()
  DB_MASTER_PORT: number = 5432;

  @IsString()
  @IsOptional()
  DB_MASTER_USERNAME?: string;

  @IsString()
  @IsOptional()
  DB_MASTER_PASSWORD?: string;

  @IsString()
  @IsOptional()
  DB_MASTER_DATABASE?: string;

  // Database Slave (Optional)
  @IsString()
  @IsOptional()
  DB_SLAVE_HOST: string;

  @IsNumber()
  @IsOptional()
  DB_SLAVE_PORT: number = 5432;

  @IsString()
  @IsOptional()
  DB_SLAVE_USERNAME: string;

  @IsString()
  @IsOptional()
  DB_SLAVE_PASSWORD: string;

  @IsString()
  @IsOptional()
  DB_SLAVE_DATABASE: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.ENV_VALIDATION_ERROR);
  }

  return validatedConfig;
}


