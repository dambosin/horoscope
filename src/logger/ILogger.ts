export interface ILogger {
  info(message?: any, ...args: any[]): void;
  warn(message?: any, ...args: any[]): void;
  error(message?: any, ...args: any[]): void;
  debug(message?: any, ...args: any[]): void;
  fatal(message?: any, ...args: any[]): void;
}
