import {config} from 'dotenv';
import {Telegraf} from 'telegraf';

import {Bot} from './bot';
import {
  ConsoleLogger,
  TelegramLogger,
  CombinedLogger,
  logLevels,
  ILogger,
} from './logger';

config();
const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
function validateEnvLogLevle(logLevel: string): logLevel is keyof ILogger {
  return logLevels.includes(logLevel as keyof ILogger);
}
const defaultConsoleLogLevel: keyof ILogger = 'trace';
const consoleLogLevel = process.env.CONSOLE_LOG_LEVEL || defaultConsoleLogLevel;
if (!validateEnvLogLevle(consoleLogLevel)) {
  throw new Error(
    `Provided incorrect value for CONSOLE_LOG_LEVEL please provide any of ${logLevels.join(' / ')}`
  );
}
const defaultTelegramLogLevel: keyof ILogger = 'info';
const telegramLogLevel =
  process.env.TELEGRAM_LOG_LEVEL || defaultTelegramLogLevel;
if (!validateEnvLogLevle(telegramLogLevel)) {
  throw new Error(
    `Provided incorrect value for TELEGRAM_LOG_LEVEL please provide any of ${logLevels.join(' / ')}`
  );
}
if (!token) {
  throw new Error('BOT_TOKEN is not set');
}
if (!chatId) {
  throw new Error('CHAT_ID is not set');
}
function getLogLevels(logLevel: keyof ILogger): (keyof ILogger)[] {
  return logLevels.slice(logLevels.findIndex(level => level === logLevel));
}
const telegraf = new Telegraf(token);
const logger = new CombinedLogger([
  new TelegramLogger(telegraf, chatId, getLogLevels(telegramLogLevel)),
  new ConsoleLogger(getLogLevels(consoleLogLevel)),
]);

try {
  logger.info('Starting bot...');
  const bot = new Bot(telegraf, logger);

  bot.run();
  logger.info('Bot started!');

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
} catch (err) {
  console.error('Fatal error occurred:', err);
  throw err;
}
