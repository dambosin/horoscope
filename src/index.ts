import {config} from 'dotenv';
import {Bot} from './bot';

config();

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error('BOT_TOKEN is not set');
} else {
  console.log('Starting bot...');
  const bot = new Bot(token);

  bot.run();
  console.log('Bot started!');

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
