import {Composer} from 'telegraf';

import {generateContent} from '../services/content.js';
import type {InlineQueryResult} from 'telegraf/types';
import {logger} from '../logger.js';

export const inlineComposer = new Composer();

inlineComposer.on('inline_query', async ctx => {
    const user = ctx.inlineQuery.from;
    try {
        if (user.username) {
            const content = generateContent(user.id, user.username);
            logger.info(
                `User ${user.username} requested mesurments and got: ${content}`
            );

            const result: InlineQueryResult[] = [
                {
                    type: 'article',
                    id: 'testing',
                    title: 'Measure your cock',
                    input_message_content: {
                        message_text: content,
                    },
                    hide_url: true,
                    description:
                        'Knowing your measurements ensures comfort and confidence. Precision makes all the difference.',
                    thumbnail_url:
                        'https://static.wikia.nocookie.net/siivagunner/images/4/40/Gachimuchi.jpg/revision/latest?cb=20181204024544',
                    thumbnail_width: 100,
                    thumbnail_height: 100,
                },
            ];

            await ctx.answerInlineQuery(result, {cache_time: 0});
        }
    } catch (err) {
        logger.error(err);
    }
});

inlineComposer.on('chosen_inline_result', async ctx => {
    logger.info(
        `Message with size was sent by ${ctx.chosenInlineResult.from.username}`
    );
});
