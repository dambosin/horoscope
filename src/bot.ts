import {Context, NarrowedContext, Telegraf} from 'telegraf';
import {
  InlineQueryResult,
  Message,
  Update,
} from 'telegraf/typings/core/types/typegram';
import {ILogger} from './logger/ILogger';

const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export class Bot {
  private readonly _telegraph: Telegraf;
  private readonly _logger: ILogger;
  constructor(token: string, logger: ILogger) {
    this._logger = logger;
    this._telegraph = new Telegraf(token);
    this._telegraph.on('inline_query', async ctx => {
      const date = new Date();
      const dateString = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
      const size = this.getCockSize(
        ctx?.inlineQuery?.from?.username ?? '',
        dateString
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
      await ctx.answerInlineQuery(result, {cache_time: 0});
    });
    this._telegraph.on('message', async ctx => {
      this._logger.info(`Recieved direct message from: '${ctx.from.username}'`);
      this._logger.info(`Message: '${ctx.text}'`);
      if (ctx.text === 'test') {
        await this.test(ctx);
      }
    });
  }

  private async test(
    ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
  ) {
    const names = ['NikeA_1337', 'Svizhen', 'dambosin'];
    for (const name of names) {
      let sum = 0;
      for (let month = 0; month < 12; month++) {
        for (let day = 0; day < days[month]; day++) {
          const datestr = `2024-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
          sum += this.getCockSize(name, datestr);
        }
      }
      await ctx.sendMessage(`${name} average is ${sum / 365}`);
    }
  }

  public run() {
    this._telegraph.launch();
  }

  public stop(reason?: string) {
    this._telegraph.stop(reason);
  }

  private getCockSize(login: string, prefix: string): number {
    const initString = prefix + login;

    const hash = this.sdbm(initString);
    function addition(x: number): number {
      let temp: number = Math.abs(x);
      let result = 0;
      while (temp > 0) {
        result += temp % 10;
        temp = Math.floor(temp / 10);
      }
      return result;
    }
    const cockSize = Math.ceil((addition(hash) % 38) + 2);
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

  private hashing = (str: string) => {
    const buffer = new TextEncoder().encode(str);

    let hash = 0;
    for (const byte of buffer) {
      hash = (hash * 31 + byte) >>> 0; // Basic hash: unsigned right shift for 32-bit unsigned integer
    }
    return hash;
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
}
