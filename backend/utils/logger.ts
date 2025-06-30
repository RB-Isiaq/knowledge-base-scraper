import { LogLevel } from "../interface";

class Logger {
  private logLevel: number;
  private levels: LogLevel = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
  };

  constructor() {
    const level = process.env.LOG_LEVEL?.toUpperCase() || "INFO";
    this.logLevel = this.levels[level as keyof LogLevel] ?? this.levels.INFO;
  }

  private log(level: keyof LogLevel, message: string, ...args: any[]) {
    if (this.levels[level] <= this.logLevel) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level}]`;
      console.log(prefix, message, ...args);
    }
  }

  error(message: string, ...args: any[]) {
    this.log("ERROR", message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log("WARN", message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log("INFO", message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log("DEBUG", message, ...args);
  }
}

export const logger = new Logger();
