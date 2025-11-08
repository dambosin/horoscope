import type {ILogger} from './ILogger.js';

export abstract class BaseLogger implements ILogger {
    constructor(protected readonly _logLevels: (keyof ILogger)[]) {}
    protected abstract logInfo(message?: unknown, ...args: unknown[]): void;
    protected abstract logWarn(message?: unknown, ...args: unknown[]): void;
    protected abstract logError(message?: unknown, ...args: unknown[]): void;
    protected abstract logDebug(message?: unknown, ...args: unknown[]): void;
    protected abstract logFatal(message?: unknown, ...args: unknown[]): void;
    protected logTrace?(message?: unknown, ...args: unknown[]): void;
    info(message?: unknown, ...args: unknown[]): void {
        if (this._logLevels.includes('info')) {
            this.logInfo(message, ...args);
        }
    }
    warn(message?: unknown, ...args: unknown[]): void {
        if (this._logLevels.includes('warn')) {
            this.logWarn(message, ...args);
        }
    }
    error(message?: unknown, ...args: unknown[]): void {
        if (this._logLevels.includes('error')) {
            this.logError(message, ...args);
        }
    }
    debug(message?: unknown, ...args: unknown[]): void {
        if (this._logLevels.includes('debug')) {
            this.logDebug(message, ...args);
        }
    }
    fatal(message?: unknown, ...args: unknown[]): void {
        if (this._logLevels.includes('fatal')) {
            this.logFatal(message, ...args);
        }
    }
    trace(message?: unknown, ...args: unknown[]): void {
        if (!this._logLevels.includes('trace')) return;
        if (!this.logTrace) throw new Error('logTrace method not implemented');
        this.logTrace(message, ...args);
    }
    protected getMetaInfo(logType: keyof ILogger): string {
        const date = new Date();
        return `[${logType.toUpperCase()}] ${date.toISOString()}:`;
    }
}
