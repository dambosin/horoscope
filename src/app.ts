import {adminComposer} from './composers/admin.js';
import {inlineComposer} from './composers/inline.js';
import {logger} from './logger.js';
import {bot} from './bot/index.js';

bot.use(adminComposer);
bot.use(inlineComposer);

export async function main() {
    try {
        bot.launch();
        logger.info(`Bot started successfully (as @${bot.botInfo?.username})`);
        console.log('App started');

        process.once('SIGINT', () => {
            bot.stop('SIGINT');
        });
        process.once('SIGTERM', () => {
            bot.stop('SIGTERM');
        });
    } catch (error) {
        logger.info('Failed to start bot:', error);
        process.exit(1);
    }
}
