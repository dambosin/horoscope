# TgBot

A Telegram bot built with Node.js, TypeScript, and a modular logger system.

## Features

- Telegram bot functionality (customize in `src/bot.ts`)
- Configurable logging (console and file, using Pino)
- Environment variable support via `.env`
- Graceful shutdown handling

## Why Pino?

Pino was chosen as the logger implementation for this project because of its high performance and excellent support for pretty, human-readable output to the console during development (using `pino-pretty`). This makes it easy to debug and monitor the application in real time, while still supporting structured logging and file output for production environments.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

```sh
npm install
```

### Configuration

Create a `.env` file in project root:

```
BOT_TOKEN=your-telegram-bot-token
```

### Running the Bot

```sh
npm run dev
```

or (if using nodemon)

```sh
npx nodemon --exec ts-node src/index.ts
```

### Running Tests

To run all tests:

```sh
npx jest
```

Or, if you have a test script in package.json:

```sh
npm test
```

### Logging

- Logs are written to the console and to `logs/app.log`.
- Log levels and transports are configured in `src/index.ts`.

## Project Structure

```
src/
  bot.ts
  index.ts
  logger/
    Logger.ts
    ILogger.ts
logs/
  app.log
```

## License

MIT
