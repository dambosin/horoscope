import {ILogger} from './ILogger';

export class Logger implements ILogger {
  constructor(private readonly logger?: ILogger) {
    if (!logger) {
      console.warn(
        'Logger is not provided, using default console logger. This may lead to missing logs in production.'
      );
    }
  }
  info(message?: any, ...args: any[]): void {
    if (this.logger) {
      this.logger.info(message, ...args);
    } else {
      console.info(this.getMetaInfo('info'), message, ...args);
    }
  }
  warn(message?: any, ...args: any[]): void {
    if (this.logger) {
      this.logger.warn(message, ...args);
    } else {
      console.warn(this.getMetaInfo('warn'), message, ...args);
    }
  }
  error(message?: any, ...args: any[]): void {
    if (this.logger) {
      this.logger.error(message, ...args);
    } else {
      console.error(this.getMetaInfo('error'), message, ...args);
    }
  }
  debug(message?: any, ...args: any[]): void {
    if (this.logger) {
      this.logger.debug(message, ...args);
    } else {
      console.debug(this.getMetaInfo('debug'), message, ...args);
    }
  }
  fatal(message?: any, ...args: any[]): void {
    if (this.logger) {
      this.logger.fatal(message, ...args);
    } else {
      console.error(this.getMetaInfo('fatal'), message, ...args);
    }
  }

  private getMetaInfo(logType: keyof ILogger): string {
    const date = new Date();
    return `[${logType.toUpperCase()}] ${date.toISOString()}:`;
  }
}
