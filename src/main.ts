import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './common/logger/logger.service';
import { NestConfig } from './config';
import { workers } from './workers';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');

  if (nestConfig.mode === 'production') {
    const logger = new LoggerService(configService);
    app.useLogger(logger);
  }

  const appService = app.get(AppService);
  appService.run(workers);
}
bootstrap();
