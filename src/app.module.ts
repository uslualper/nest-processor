import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { TestModule } from './modules/test/test.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JobTrackerModule } from './job-tracker/job-tracker.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongoConfig, MurlockConfig, NestConfig, RedisConfig, SlackConfig } from './config';
import { SlackModule } from 'nestjs-slack';
import { CommonModule } from './common/common.module';
import { MurLockModule } from 'murlock';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [config],
    }),
    MurLockModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redisOptions: {
          url: `redis://${configService.get<RedisConfig>('redis').host}:${configService.get<RedisConfig>('redis').port}`,
          password: configService.get<RedisConfig>('redis').password,
          database: configService.get<RedisConfig>('redis').db,
        },
        wait: configService.get<MurlockConfig>('murlock').wait,
        maxAttempts: configService.get<MurlockConfig>('murlock').maxAttempts,
        logLevel: configService.get<MurlockConfig>('murlock').logLevel,
        ignoreUnlockFail: configService.get<MurlockConfig>('murlock').ignoreUnlockFail
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<MongoConfig>('mongo').url,
      }),
    }),
    SlackModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'api',
        token: configService.get<SlackConfig>('slack').token,
        defaultChannel: configService.get<SlackConfig>('slack').channel,
        botName: configService.get<NestConfig>('nest').name,
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    CommonModule,
    JobTrackerModule,
    TestModule,
  ],
  providers: [AppService],
})
export class AppModule { }
