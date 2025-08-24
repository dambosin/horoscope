/* eslint-disable @typescript-eslint/no-explicit-any */
import {Telegraf} from 'telegraf';
import {ILogger} from './ILogger';
import {BaseLogger} from './BaseLogger';

export class TelegramLogger extends BaseLogger {
  private readonly _telegraf: Telegraf;
  private readonly _chatId: string;
  constructor(
    telegraf: Telegraf,
    chatId: string,
    logLevels: (keyof ILogger)[]
  ) {
    super(logLevels);
    this._telegraf = telegraf;
    if (!chatId) {
      throw new Error('Chat ID is not set');
    }
    this._chatId = chatId;
  }

  logInfo(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('info', message, args));
  }
  logWarn(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('warn', message, args));
  }
  logError(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('error', message, args));
  }
  logDebug(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('debug', message, args));
  }
  logFatal(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('fatal', message, args));
  }
  logTrace(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('trace', message, args));
  }

  private sendMessage(message: string) {
    this._telegraf.telegram.sendMessage(this._chatId, message);
  }

  private getMessage(
    logType: keyof ILogger,
    message?: any,
    ...args: any[]
  ): string {
    let resultMessage = this.getMetaInfo(logType);
    resultMessage += ' ' + message;
    if (args) {
      resultMessage += ' ' + args.toString();
    }
    return resultMessage;
  }
}
