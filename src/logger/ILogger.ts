export interface ILogger {
    trace(message?: unknown, ...args: unknown[]): void;
    debug(message?: unknown, ...args: unknown[]): void;
    info(message?: unknown, ...args: unknown[]): void;
    warn(message?: unknown, ...args: unknown[]): void;
    error(message?: unknown, ...args: unknown[]): void;
    fatal(message?: unknown, ...args: unknown[]): void;
}
