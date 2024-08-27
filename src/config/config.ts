import { Config } from "./config.interface";
import * as process from "node:process";

export default (): Config => {
  return {
    nest: {
      name: process.env.APP_NAME || "app",
      mode: process.env.APP_MODE || "development"
    },
    sentry: {
      dsn: process.env.SENTRY_DSN || ""
    },
    elasticsearch: {
      cloudId: process.env.ELASTIC_CLOUD_ID || "",
      apiKey: process.env.ELASTIC_API_KEY || "",
      url: process.env.ELASTIC_URL || ""
    },
    mongo: {
      url: process.env.MONGODB_URL || ""
    },
    redis: {
      host: process.env.REDIS_HOST || "",
      port: parseInt(process.env.REDIS_PORT || "0", 10),
      password: process.env.REDIS_PASSWORD || "",
      db: parseInt(process.env.REDIS_DB || "0", 10)
    },
    murlock: {
      wait: parseInt(process.env.MURLOCK_WAIT || "1000", 10),
      maxAttempts: parseInt(process.env.MURLOCK_MAX_ATTEMPTS || "3", 10),
      logLevel: (process.env.LOG_LEVEL || "log") as "none" | "error" | "warn" | "log" | "debug",
      ignoreUnlockFail: process.env.MURLOCK_IGNORE_UNLOCK_FAIL === "true"
    },
    slack: {
      token: process.env.SLACK_TOKEN || "",
      channel: process.env.SLACK_CHANNEL || ""
    },
  };
};
