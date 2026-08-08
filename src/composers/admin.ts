import {Composer} from 'telegraf';

import {adminOnly} from './middleware.js';
import {logger} from '../logger.js';
import {overrideManager} from '../overrides/OverridesManager.js';

export const adminComposer = new Composer();

adminComposer.command('set_override', adminOnly, async ctx => {
    const args = ctx.message.text.split(' ').slice(1);
    const [userId, userName, monthNumber, dayNumber, ...templateParts] = args;
    const template = templateParts.join(' ');

    const regularTemplateRegex = /regular\[([^\]]*)\]/;
    const insideTemplateRegex = /inside\[([^\]]*)\]/;
    let regularTemplate: string = '';
    let insideTemplate: string = '';
    console.log(template);
    const regularMatch = template.match(regularTemplateRegex);
    if (regularMatch) {
        regularTemplate = regularMatch[1];
    }
    const insideMatch = template.match(insideTemplateRegex);
    if (insideMatch) {
        insideTemplate = insideMatch[1];
    }
    console.log(regularMatch);
    console.log(insideMatch);

    if (
        !userId ||
        !userName ||
        !monthNumber ||
        !dayNumber ||
        !regularTemplate ||
        !insideTemplate
    ) {
        return ctx.reply(
            'Usage: /set_override <userId> <userName> <monthNumber> <dayNumber> regular[<regularTemplate>] inside[<insideTemplate>]'
        );
    }

    overrideManager.createOverride({
        type: 'User_Date',
        userId: Number(userId),
        userName,
        value: {
            regular: regularTemplate,
            inside: insideTemplate,
        },
        date: {
            month: Number(monthNumber),
            day: Number(dayNumber),
        },
    });

    const message = `Override set for user ${userId} ${userName} on ${monthNumber}-${dayNumber}.`;
    logger.info(message);

    return ctx.reply(`✅ ${message}`);
});

adminComposer.command('set_user_default', adminOnly, async ctx => {
    const args = ctx.message.text.split(' ').slice(1);
    const [userId, userName, ...templateParts] = args;
    const template = templateParts.join(' ');

    const regularTemplateRegex = /regular\[([^\]]+)\]/;
    const insideTemplateRegex = /inside\[([^\]]+)\]/;
    let regularTemplate: string = '';
    let insideTemplate: string = '';
    const regularMatch = template.match(regularTemplateRegex);
    if (regularMatch) {
        regularTemplate = regularMatch[1];
    }
    const insideMatch = template.match(insideTemplateRegex);
    if (insideMatch) {
        insideTemplate = insideMatch[1];
    }

    if (!userId || !userName || !regularTemplate || !insideTemplate) {
        return ctx.reply(
            'Usage: /set_user_default <userId> <userName> regular[<regularTemplate>] inside[<insideTemplate>]'
        );
    }

    overrideManager.createOverride({
        type: 'User',
        userId: Number(userId),
        userName,
        value: {
            regular: regularTemplate,
            inside: insideTemplate,
        },
    });

    const message = `Override set for user ${userId} ${userName}.`;
    logger.info(message);

    return ctx.reply(`✅ ${message}`);
});

// /set_date_default <date> <template>
adminComposer.command('set_date_default', adminOnly, async ctx => {
    const args = ctx.message.text.split(' ').slice(1);
    const [monthNumber, dayNumber, ...templateParts] = args;
    const template = templateParts.join(' ');
    const regularTemplateRegex = /regular\[([^\]]+)\]/;
    const insideTemplateRegex = /inside\[([^\]]+)\]/;
    let regularTemplate: string = '';
    let insideTemplate: string = '';
    const regularMatch = template.match(regularTemplateRegex);
    if (regularMatch) {
        regularTemplate = regularMatch[1];
    }
    const insideMatch = template.match(insideTemplateRegex);
    if (insideMatch) {
        insideTemplate = insideMatch[1];
    }
    if (!monthNumber || !dayNumber || !regularTemplate || !insideTemplate) {
        return ctx.reply(
            'Usage: /set_date_default <monthNumber> <dayNumber> regular[<regularTemplate>] inside[<insideTemplate>]'
        );
    }

    overrideManager.createOverride({
        type: 'Date',
        date: {
            month: Number(monthNumber),
            day: Number(dayNumber),
        },
        value: {
            regular: regularTemplate,
            inside: insideTemplate,
        },
    });

    const message = `Override set on ${monthNumber}-${dayNumber}.`;
    logger.info(message);

    return ctx.reply(`✅ ${message}`);
});

adminComposer.command('set_default', adminOnly, async ctx => {
    const args = ctx.message.text.split(' ').slice(1);
    const template = args.join(' ');
    const regularTemplateRegex = /regular\[([^\]]+)\]/;
    const insideTemplateRegex = /inside\[([^\]]+)\]/;
    let regularTemplate: string = '';
    let insideTemplate: string = '';
    const regularMatch = template.match(regularTemplateRegex);
    if (regularMatch) {
        regularTemplate = regularMatch[1];
    }
    const insideMatch = template.match(insideTemplateRegex);
    if (insideMatch) {
        insideTemplate = insideMatch[1];
    }
    if (!regularTemplate || !insideTemplate) {
        return ctx.reply(
            'Usage: /set_default regular[<regularTemplate>] inside[<insideTemplate>]'
        );
    }

    overrideManager.createOverride({
        type: 'Default',
        value: {
            regular: regularTemplate,
            inside: insideTemplate,
        },
    });

    const message = `Default override set.`;
    logger.info(message);

    return ctx.reply(`✅ ${message}`);
});

// /list_overrides
adminComposer.command('list_overrides', adminOnly, async ctx => {
    const overrides = overrideManager.getOverrides();

    logger.info('All overrides were requested');

    return ctx.reply(
        overrides.length > 0
            ? overrides
                  .map(override => {
                      switch (override.type) {
                          case 'User_Date':
                              return [
                                  `Id: ${override.id}`,
                                  `Type: User_Date`,
                                  `User Id: ${override.userId}`,
                                  `Username: ${override.userName}`,
                                  `Date: ${override.date.month}-${override.date.day}`,
                                  `Regular: ${override.value.regular}`,
                                  `Inside: ${override.value.inside}`,
                              ].join('\n');
                          case 'User':
                              return [
                                  `Id: ${override.id}`,
                                  `Type: User`,
                                  `User Id: ${override.userId}`,
                                  `Username: ${override.userName}`,
                                  `Regular: ${override.value.regular}`,
                                  `Inside: ${override.value.inside}`,
                              ].join('\n');
                          case 'Date':
                              return [
                                  `Id: ${override.id}`,
                                  `Type: Date`,
                                  `Date: ${override.date.month}-${override.date.day}`,
                                  `Regular: ${override.value.regular}`,
                                  `Inside: ${override.value.inside}`,
                              ].join('\n');
                          case 'Default':
                              return [
                                  `Id: ${override.id}`,
                                  `Type: Default`,
                                  `Regular: ${override.value.regular}`,
                                  `Inside: ${override.value.inside}`,
                              ].join('\n');
                          default:
                              return '';
                      }
                  })
                  .join('\n###################\n')
            : 'No overides exist'
    );
});

// /delete_override <override_id>
adminComposer.command('delete_override', adminOnly, async ctx => {
    const args = ctx.message.text.split(' ').slice(1);
    const [overrideId] = args;
    overrideManager.deleteOverride(Number(overrideId));

    const message = `Override ${overrideId} was successfully deleted`;
    logger.info(message);

    return ctx.reply(`✅ ${message}`);
});
