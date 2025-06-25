import {config} from 'dotenv';
import {Bot} from './bot';
import {Logger} from './logger/Logger';

config();
// const logLevel = process.env.LOG_LEVEL || 'info';
const token = process.env.BOT_TOKEN;

const logger = new Logger();

try {
  if (!token) {
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
} catch (err) {
  logger.fatal('Fatal error occurred:', err);
  throw err;
}
