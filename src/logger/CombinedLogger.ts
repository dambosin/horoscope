/* eslint-disable @typescript-eslint/no-explicit-any */
import {ILogger} from './ILogger';

export class CombinedLogger implements ILogger {
  constructor(private readonly _loggers: ILogger[]) {}

  info(message?: any, ...args: any[]): void {
    this._loggers.forEach(logger => logger.info(message, ...args));
  }
  warn(message?: any, ...args: any[]): void {
    this._loggers.forEach(logger => logger.warn(message, ...args));
  }
  error(message?: any, ...args: any[]): void {
    this._loggers.forEach(logger => logger.error(message, ...args));
  }
  debug(message?: any, ...args: any[]): void {
    this._loggers.forEach(logger => logger.debug(message, ...args));
  }
  fatal(message?: any, ...args: any[]): void {
    this._loggers.forEach(logger => logger.fatal(message, ...args));
  }
  trace(message?: any, ...args: any[]): void {
    this._loggers.forEach(
      logger => logger.trace && logger.trace(message, ...args)
    );
  }
}
