/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILogger {
  trace(message?: any, ...args: any[]): void;
  debug(message?: any, ...args: any[]): void;
  info(message?: any, ...args: any[]): void;
  warn(message?: any, ...args: any[]): void;
  error(message?: any, ...args: any[]): void;
  fatal(message?: any, ...args: any[]): void;
}
