import {Telegraf} from 'telegraf';
import type {ILogger} from './ILogger.js';
import {BaseLogger} from './BaseLogger.js';
import type {BotContext} from '../bot/type.js';

export class TelegramLogger extends BaseLogger {
    private readonly _telegraf: Telegraf<BotContext>;
    private readonly _chatId: string;
    private readonly _infoTheadId: number;
    private readonly _warningTheadId: number;
    private readonly _errorTheadId: number;
    constructor(
        telegraf: Telegraf<BotContext>,
        chatId: string,
        infoTheadId: number,
        warningTheadId: number,
        errorTheadId: number,
        logLevels: (keyof ILogger)[]
    ) {
        super(logLevels);
        this._telegraf = telegraf;
        this._chatId = chatId;
        this._infoTheadId = infoTheadId;
        this._warningTheadId = warningTheadId;
        this._errorTheadId = errorTheadId;
    }

    protected logInfo(message?: unknown, ...args: unknown[]): void {
        this.sendMessage(this.getMessage('info', message, ...args), [
            this._infoTheadId,
        ]);
    }
    protected logWarn(message?: unknown, ...args: unknown[]): void {
        this.sendMessage(this.getMessage('warn', message, ...args), [
            this._infoTheadId,
            this._warningTheadId,
        ]);
    }
    protected logError(message?: unknown, ...args: unknown[]): void {
        this.sendMessage(this.getMessage('error', message, ...args), [
            this._infoTheadId,
            this._errorTheadId,
        ]);
    }
    protected logDebug(message?: unknown, ...args: unknown[]): void {
        this.sendMessage(this.getMessage('debug', message, ...args), [
            this._infoTheadId,
        ]);
    }
    protected logFatal(message?: unknown, ...args: unknown[]): void {
        this.sendMessage(this.getMessage('fatal', message, ...args), [
            this._infoTheadId,
            this._errorTheadId,
        ]);
    }
    protected logTrace(message?: unknown, ...args: unknown[]): void {
        this.sendMessage(this.getMessage('trace', message, ...args), [
            this._infoTheadId,
        ]);
    }

    private sendMessage(message: string, treadIds: number[]) {
        treadIds.forEach(threadId =>
            this._telegraf.telegram.sendMessage(this._chatId, message, {
                message_thread_id: threadId,
            })
        );
    }

    private getMessage(
        logType: keyof ILogger,
        message?: unknown,
        ...args: unknown[]
    ): string {
        let resultMessage = this.getMetaInfo(logType);
        resultMessage += ' ' + message;
        if (args) {
            resultMessage += ' ' + args.join(' / ');
        }
        return resultMessage;
    }
}
