import {Logger} from '../logger/Logger';

describe('Logger', () => {
  it('should log info messages without error', () => {
    const logger = new Logger();
    expect(() => logger.info('test info')).not.toThrow();
  });

  it('should log error messages without error', () => {
    const logger = new Logger();
    expect(() => logger.error('test error')).not.toThrow();
  });

  it('should log warn messages without error', () => {
    const logger = new Logger();
    expect(() => logger.warn('test warn')).not.toThrow();
  });

  it('should log debug messages without error', () => {
    const logger = new Logger();
    expect(() => logger.debug('test debug')).not.toThrow();
  });
});
