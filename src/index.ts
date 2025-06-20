import {config} from 'dotenv';
import {Bot} from './bot';
import {Logger} from './logger/logger';

config();

const token = process.env.BOT_TOKEN;
const logger = new Logger();

if (!token) {
  logger.fatal('BOT_TOKEN is not set');
  throw new Error('BOT_TOKEN is not set');
} else {
  logger.info('Starting bot...');
  const bot = new Bot(token, logger);

  bot.run();
  logger.info('Bot started!');

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
