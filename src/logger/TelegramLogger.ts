import {Telegraf} from 'telegraf';
import {ILogger} from './ILogger';

export class TelegramLogger implements ILogger {
  private readonly _telegraf: Telegraf;
  private readonly _chatId: string;
  constructor(telegraf: Telegraf, chatId: string) {
    this._telegraf = telegraf;
    if (!chatId) {
      throw new Error('Chat ID is not set');
    }
    this._chatId = chatId;
  }

  private sendMessage(message: string) {
    this._telegraf.telegram.sendMessage(this._chatId, message);
  }

  info(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('info', message, args));
  }
  warn(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('warn', message, args));
  }
  error(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('error', message, args));
  }
  debug(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('debug', message, args));
  }
  fatal(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('fatal', message, args));
  }
  trace?(message?: any, ...args: any[]): void {
    this.sendMessage(this.getMessage('trace', message, args));
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
  private getMetaInfo(logType: keyof ILogger): string {
    const date = new Date();
    return `[${logType.toUpperCase()}] ${date.toISOString()}:`;
  }
}
