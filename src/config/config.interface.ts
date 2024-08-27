export interface NestConfig {
  name: string;
  mode: string;
}

export interface SentryConfig {
  dsn: string;
}

export interface ElasticsearchConfig {
  cloudId: string;
  apiKey: string;
  url: string;
}

export interface MongoConfig {
  url: string;
}

export interface SlackConfig {
  token: string;
  channel: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
}

export interface MurlockConfig {
  wait: number;
  maxAttempts: number;
  logLevel: 'none' | 'error' | 'warn' | 'log' | 'debug';
  ignoreUnlockFail: boolean;
}

export interface Config {
  nest: NestConfig;
  sentry: SentryConfig;
  elasticsearch: ElasticsearchConfig;
  mongo: MongoConfig;
  redis: RedisConfig;
  murlock: MurlockConfig;
  slack: SlackConfig;
}