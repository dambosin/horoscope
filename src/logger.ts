import {bot} from './bot/index.js';
import {config} from './config.js';
import {TelegramLogger} from './logger/TelegramLogger.js';

export const logger = new TelegramLogger(
    bot,
    config.LOGS_CHAT_ID,
    config.INFO_LOGS_THREAD,
    config.WARNING_LOGS_THREAD,
    config.ERROR_LOGS_THREAD,
    ['debug', 'trace', 'info', 'warn', 'error', 'fatal']
);
