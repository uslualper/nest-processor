import { LoggerService as NestLoggerService, Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as Transport from 'winston-transport';

import { ElasticsearchTransport } from 'winston-elasticsearch';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchConfig, NestConfig, SentryConfig } from 'src/config';

@Injectable()
export class LoggerService implements NestLoggerService {

  private logger: winston.Logger;

  constructor(
    configService: ConfigService,
  ) {

    const nestConfig = configService.get<NestConfig>('nest');
    const elasticsearchConfig = configService.get<ElasticsearchConfig>('elasticsearch');
    const sentryConfig = configService.get<SentryConfig>('sentry');

    const consoleTransport = new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context, trace }) => {
          return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
        }),
      ),
    });

    const transports: Transport[] = [consoleTransport]
    if (nestConfig.mode == "production") {
      const esTransport = new ElasticsearchTransport({
        level: 'info',
        indexPrefix: nestConfig.name.toLowerCase(),
        indexSuffixPattern: 'YYYY.MM.DD',
        healthCheckTimeout: "5s",
        retryLimit: 5,
        clientOpts: {
          node: elasticsearchConfig.url,
          cloud: {
            id: elasticsearchConfig.cloudId,
          },
          auth: {
            apiKey: elasticsearchConfig.apiKey,
          },
        },
      }).on('error', (error) => {
        this.fatal(`Elasticsearch transport error: ${error.message}`, error.stack);
      });
      transports.push(esTransport)
    }
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: transports,
    });
  }

  log(message: any, context?: string) {
    this.logger.info(JSON.stringify(message), { context });
  }

  fatal(message: any, trace?: string, context?: string) {
    this.logger.error(JSON.stringify(message), { context, trace });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(JSON.stringify(message), { context, trace });
  }

  warn(message: any, context?: string) {
    this.logger.warn(JSON.stringify(message), { context });
  }

  debug?(message: any, context?: string) {
    this.logger.debug(JSON.stringify(message), { context });
  }

  verbose?(message: any, context?: string) {
    this.logger.info(JSON.stringify(message), { context });
  }
}