# Logger Module

This folder contains the logging abstraction and implementation for the TgBot project.

## Files

- **ILogger.ts**  
  Defines the `ILogger` interface with methods for different log levels (`info`, `warn`, `error`, `debug`, `fatal`).

- **Logger.ts**  
  Implements the `ILogger` interface. Wraps a provided logger or falls back to the console.

## Usage

Inject a logger into the `Logger` class:

If no logger is provided, the class uses the default Node.js console methods.

## Extending

You can implement your own logger by creating a class that implements `ILogger` and passing it to the `Logger` constructor.
