/* eslint-disable @typescript-eslint/no-explicit-any */
import {BaseLogger} from './BaseLogger';

export class ConsoleLogger extends BaseLogger {
  logInfo(message?: any, ...args: any[]): void {
    console.info(this.getMetaInfo('info'), message, ...args);
  }
  logWarn(message?: any, ...args: any[]): void {
    console.warn(this.getMetaInfo('warn'), message, ...args);
  }
  logError(message?: any, ...args: any[]): void {
    console.error(this.getMetaInfo('error'), message, ...args);
  }
  logDebug(message?: any, ...args: any[]): void {
    console.debug(this.getMetaInfo('debug'), message, ...args);
  }
  logFatal(message?: any, ...args: any[]): void {
    console.error(this.getMetaInfo('fatal'), message, ...args);
  }
}
