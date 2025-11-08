import {Composer} from 'telegraf';

import {adminOnly} from './middleware.js';
import type {BotContext} from '../bot/type.js';
import {logger} from '../logger.js';

export const adminComposer = new Composer<BotContext>();
adminComposer.use(adminOnly);

// /set_override <userName> <date> <template>
adminComposer.command('set_override', async ctx => {
    const args = ctx.message.text.split(' ').slice(1);
    const [userName, date, ...templateParts] = args;
    const template = templateParts.join(' ');

    if (!userName || !date || !template) {
        return ctx.reply('Usage: /set_override <userName> <date> <template>');
    }

    await ctx.db.overrideRule.upsert({
        where: {userName_date: {userName, date}},
        update: {template},
        create: {userName, date, template},
    });

    const message = `Override set for user ${userName} on ${date}.`;
    logger.info(message);

    return ctx.reply(`✅ ${message}`);
});

// /set_user_default <userName> <template>
adminComposer.command('set_user_default', async ctx => {
    const args = ctx.message.text.split(' ').slice(1);
    const [userName, ...templateParts] = args;
    const template = templateParts.join(' ');

    if (!userName || !template) {
        return ctx.reply('Usage: /set_user_default <userName> <template>');
    }

    await ctx.db.overrideRule.upsert({
        where: {userName_date: {userName, date: ''}},
        update: {template},
        create: {userName, date: '', template},
    });

    const message = `Override set for user ${userName}.`;
    logger.info(message);

    return ctx.reply(`✅ ${message}`);
});

// /set_date_default <date> <template>
adminComposer.command('set_date_default', async ctx => {
    const args = ctx.message.text.split(' ').slice(1);
    const [date, ...templateParts] = args;
    const template = templateParts.join(' ');

    if (!date || !template) {
        return ctx.reply('Usage: /set_date_default <date> <template>');
    }

    await ctx.db.overrideRule.upsert({
        where: {userName_date: {userName: '', date}},
        update: {template},
        create: {userName: '', date, template},
    });

    const message = `Override set on ${date}.`;
    logger.info(message);

    return ctx.reply(`✅ ${message}`);
});

// /list_overrides
adminComposer.command('list_overrides', async ctx => {
    const overrides = await ctx.db.overrideRule.findMany();

    logger.info('All overrides were requested');

    return ctx.reply(
        overrides.length > 0
            ? overrides
                  .map(
                      override =>
                          `Id: '${override.id}', User: '${override.userName}', date: '${override.date}', template: '${override.template}'`
                  )
                  .join('\n')
            : 'No overides exist'
    );
});

// /delete_override <override_id>
adminComposer.command('delete_override', async ctx => {
    const args = ctx.message.text.split(' ').slice(1);
    const [overrideId] = args;
    await ctx.db.overrideRule.delete({
        where: {
            id: parseInt(overrideId),
        },
    });

    const message = `Override ${overrideId} was successfully deleted`;
    logger.info(message);

    return ctx.reply(`✅ ${message}`);
});
