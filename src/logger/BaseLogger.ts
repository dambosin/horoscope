/* eslint-disable @typescript-eslint/no-explicit-any */
import {ILogger} from './ILogger';

export abstract class BaseLogger implements ILogger {
  constructor(protected readonly _logLevels: (keyof ILogger)[]) {}
  abstract logInfo(message?: any, ...args: any[]): void;
  abstract logWarn(message?: any, ...args: any[]): void;
  abstract logError(message?: any, ...args: any[]): void;
  abstract logDebug(message?: any, ...args: any[]): void;
  abstract logFatal(message?: any, ...args: any[]): void;
  logTrace?(message?: any, ...args: any[]): void;
  info(message?: any, ...args: any[]): void {
    this._logLevels.includes('info') && this.logInfo(message, ...args);
  }
  warn(message?: any, ...args: any[]): void {
    this._logLevels.includes('warn') && this.logWarn(message, ...args);
  }
  error(message?: any, ...args: any[]): void {
    this._logLevels.includes('error') && this.logError(message, ...args);
  }
  debug(message?: any, ...args: any[]): void {
    this._logLevels.includes('debug') && this.logDebug(message, ...args);
  }
  fatal(message?: any, ...args: any[]): void {
    this._logLevels.includes('fatal') && this.logFatal(message, ...args);
  }
  trace(message?: any, ...args: any[]): void {
    if (!this._logLevels.includes('trace')) return;
    if (!this.logTrace) throw new Error('logTrace method not implemented');
    this.logTrace(message, ...args);
  }
  protected getMetaInfo(logType: keyof ILogger): string {
    const date = new Date();
    return `[${logType.toUpperCase()}] ${date.toISOString()}:`;
  }
}
