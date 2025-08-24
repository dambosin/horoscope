import {Context, NarrowedContext, Telegraf} from 'telegraf';
import {
  InlineQueryResult,
  Message,
  Update,
} from 'telegraf/typings/core/types/typegram';

import {ILogger} from './logger';

export class Bot {
  private readonly _telegraph: Telegraf;
  private readonly _logger: ILogger;
  constructor(telegraf: Telegraf, logger: ILogger) {
    this._logger = logger;
    this._telegraph = telegraf;
    this._telegraph.on('inline_query', async ctx => {
      const username = ctx.inlineQuery.from.username;
      const size = this.getCockSizeFromString(
        username + this.getUniqueDayIdentifier(new Date())
      );
      const result: InlineQueryResult[] = [
        {
          type: 'article',
          id: 'testing',
          title: 'Measure your cock',
          input_message_content: {
            message_text: `My cock size is ${size}cm ${this.getEmoji(size)}`,
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
      this._logger.info(
        `User ${username} requested mesurments and got ${size}cm`
      );
      await ctx.answerInlineQuery(result, {cache_time: 0});
    });
    this._telegraph.on('message', async ctx => {
      const username = ctx.from.username;
      const text = ctx.text;
      this._logger.info(`Recieved direct message from: '${username}'`);
      this._logger.info(`Message: '${text}'`);
      if (username === 'dambosin' && text?.startsWith('test')) {
        await this.test(ctx);
      }
    });
  }

  private async test(
    ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
  ) {
    const testUsername = ctx.text?.split(' ')?.[1] ?? '';
    if (testUsername === '') {
      await ctx.sendMessage('Please provide username to test');
      await ctx.sendMessage('Example: test <username>');
      return;
    }
    const resultValuesCount = [...Array(40)].map(() => 0);
    const numberOfDaysToTest = 1500;
    for (let i = 0; i < numberOfDaysToTest; i++) {
      const date = new Date();
      const size = this.getCockSizeFromString(
        testUsername +
          this.getUniqueDayIdentifier(
            new Date(date.getFullYear(), date.getMonth(), date.getDate() - i)
          )
      );
      resultValuesCount[size]++;
    }
    await ctx.sendMessage(
      resultValuesCount
        .map(
          (count, index) =>
            `${index < 10 ? `0${index}` : index}: ${[...Array(count)].map(() => '-').join('')}`
        )
        .join('\n')
    );
    await ctx.sendMessage(
      `Average value is ${resultValuesCount.reduce((sum, count, index) => sum + index * count) / numberOfDaysToTest}`
    );
  }

  public run() {
    this._telegraph.launch();
  }

  public stop(reason?: string) {
    this._telegraph.stop(reason);
  }

  private getCockSizeFromString(value: string): number {
    const seed = this.cyrb128(value);
    const rand = this.sfc32(seed[0], seed[2], seed[2], seed[3]);
    const hash = rand();
    const cockSize = Math.ceil(hash * 37 + 2);
    return cockSize;
  }

  private getEmoji(size: number): string {
    let result = '';
    if (size <= 5) {
      result = '😭';
    } else if (size <= 10) {
      result = '🙁';
    } else if (size <= 15) {
      result = '😐';
    } else if (size <= 20) {
      result = '😏';
    } else if (size <= 30) {
      result = '🥳';
    } else if (size < 40) {
      result = '😨';
    } else {
      result = '😎';
    }
    return result;
  }

  private getUniqueDayIdentifier(date: Date): string {
    return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
  }

  private cyrb128(str: string) {
    let h1 = 1779033703,
      h2 = 3144134277,
      h3 = 1013904242,
      h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    (h1 ^= h2 ^ h3 ^ h4), (h2 ^= h1), (h3 ^= h1), (h4 ^= h1);
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
  }

  private sfc32(a: number, b: number, c: number, d: number) {
    return function () {
      a |= 0;
      b |= 0;
      c |= 0;
      d |= 0;
      const t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }
}
