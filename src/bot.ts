import {Context, NarrowedContext, Telegraf} from 'telegraf';
import {
  InlineQueryResult,
  Message,
  Update,
} from 'telegraf/typings/core/types/typegram';
import {ILogger} from './logger/ILogger';

export class Bot {
  private readonly _telegraph: Telegraf;
  private readonly _logger: ILogger;
  constructor(token: string, logger: ILogger) {
    if (!token) {
      throw new Error('Bot token is required');
    }
    this._logger = logger;
    this._telegraph = new Telegraf(token);
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
      console.log(`User ${username} requested mesurments and got ${size}cm`);
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
    const hash = this.sdbm(value);
    const cockSize = Math.ceil((Math.abs(hash) % 38) + 2);
    if (cockSize < 2 || cockSize > 39) {
      console.log(cockSize);
    }
    return cockSize;
  }

  private sdbm = (str: string) => {
    const arr = str.split('');
    return arr.reduce((hashCode, currentValue) => {
      hashCode =
        currentValue.charCodeAt(0) +
        (hashCode << 6) +
        (hashCode << 16) -
        hashCode;
      return hashCode;
    }, 0);
  };

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
}
