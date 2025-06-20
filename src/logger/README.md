# Logger Module

This folder contains the logging abstraction and implementation for the TgBot project.

## Files

- **ILogger.ts**  
  Defines the `ILogger` interface with methods for different log levels (`info`, `warn`, `error`, `debug`, `fatal`).

- **Logger.ts**  
  Implements the `ILogger` interface. Wraps a provided logger (e.g., Pino) or falls back to the console.

## Usage

Inject a logger (such as a Pino instance) into the `Logger` class:

```typescript
import pino from 'pino';
import { Logger } from './logger/Logger';

const pinoLogger = pino({ level: 'info' });
const logger = new Logger(pinoLogger);

logger.info('This is an info message');
logger.error('This is an error message');
```

If no logger is provided, the class uses the default Node.js console methods.

## Extending

You can implement your own logger by creating a class that implements `ILogger` and passing it to the `Logger` constructor.
