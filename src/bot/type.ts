import {PrismaClient} from '@prisma/client';
import {Context} from 'telegraf';

export interface BotContext extends Context {
    db: PrismaClient;
}
