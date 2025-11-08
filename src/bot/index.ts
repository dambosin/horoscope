import {Telegraf} from 'telegraf';

import {config} from '../config.js';
import type {BotContext} from './type.js';

export const bot = new Telegraf<BotContext>(config.BOT_TOKEN);
