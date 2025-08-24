import {ILogger} from './ILogger';

const logLevelsObject: Record<keyof ILogger, null> = {
  trace: null,
  debug: null,
  info: null,
  warn: null,
  error: null,
  fatal: null,
};
export const logLevels: (keyof ILogger)[] = Object.keys(
  logLevelsObject
) as (keyof ILogger)[];
