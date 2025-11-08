import {PrismaClient} from '@prisma/client';

import {adminComposer} from './composers/admin.js';
import {inlineComposer} from './composers/inline.js';
import {logger} from './logger.js';
import {bot} from './bot/index.js';

const prisma = new PrismaClient();
bot.use((ctx, next) => {
    ctx.db = prisma;
    return next();
});

bot.use(adminComposer);
bot.use(inlineComposer);

export async function main() {
    try {
        await prisma.$connect();
        logger.info('Database connected successfully.');

        bot.launch();
        logger.info(`Bot started successfully (as @${bot.botInfo?.username})`);
        console.log('App started');

        process.once('SIGINT', () => {
            bot.stop('SIGINT');
            prisma.$disconnect();
        });
        process.once('SIGTERM', () => {
            bot.stop('SIGTERM');
            prisma.$disconnect();
        });
    } catch (error) {
        logger.info('Failed to start bot:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
