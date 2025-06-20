# TgBot

A Telegram bot built with Node.js, TypeScript, and a modular logger system.

## Features

- Telegram bot functionality (customize in `src/bot.ts`)
- Configurable logging (console and file, using Pino)
- Environment variable support via `.env`
- Graceful shutdown handling

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
