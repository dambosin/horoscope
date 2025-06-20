import {Bot} from '../bot';
import {Logger} from '../logger/Logger';

describe('Bot', () => {
  it('should throw if token is missing', () => {
    const logger = new Logger();
    expect(() => new Bot('', logger)).toThrow();
  });
});
