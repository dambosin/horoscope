import {Context, Middleware} from 'telegraf';
import {config} from '../config.js';
import {logger} from '../logger.js';

export const adminOnly: Middleware<Context> = (ctx, next) => {
    if (ctx.from && ctx.from.id.toString() === config.ADMIN_ID) {
        return next();
    } else {
        logger.warn(
            `Unauthorized access attempt by user: ${ctx.from ? ctx.from.username : 'unknown'}`
        );
        return ctx.reply(
            'Sorry, you do not have permission to use this command.'
        );
    }
};
