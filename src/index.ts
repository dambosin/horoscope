import {config} from 'dotenv';
import {Bot} from './bot';
import {Logger} from './logger/Logger';
import {Telegraf} from 'telegraf';
import {TelegramLogger} from './logger/TelegramLogger';

config();
// const logLevel = process.env.LOG_LEVEL || 'info';
const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
if (!token) {
  throw new Error('BOT_TOKEN is not set');
}
if (!chatId) {
  throw new Error('CHAT_ID is not set');
}
const telegraf = new Telegraf(token);
const logger = new Logger(new TelegramLogger(telegraf, chatId));

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
