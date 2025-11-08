import 'dotenv/config';

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
    throw new Error('BOT_TOKEN is not set in your .env file');
}

const adminId = process.env.ADMIN_ID;
if (!adminId) {
    throw new Error('ADMIN_ID is not set in your .env file');
}

const logsChatId = process.env.LOGS_CHAT_ID;
if (!logsChatId) {
    throw new Error('LOGS_CHAT_ID is not set in your .env file');
}

const infoLogsThread = process.env.INFO_LOGS_THREAD;
if (!infoLogsThread) {
    throw new Error('INFO_LOGS_THREAD is not set in your .env file');
}
const parsedInfoLogsThread = parseInt(infoLogsThread);
if (isNaN(parsedInfoLogsThread)) {
    throw new Error('INFO_LOGS_THREAD is not a number');
}

const warningLogsThread = process.env.WARNING_LOGS_THREAD;
if (!warningLogsThread) {
    throw new Error('WARNIN_LOGS_THREAD is not set in your .env file');
}
const parsedWarningLogsThread = parseInt(warningLogsThread);
if (isNaN(parsedWarningLogsThread)) {
    throw new Error('WARNIN_LOGS_THREAD is not a number');
}

const errorLogsThread = process.env.ERROR_LOGS_THREAD;
if (!errorLogsThread) {
    throw new Error('ERROR_LOGS_THREAD is not set in your .env file');
}
const parsedErrorLogsThread = parseInt(errorLogsThread);
if (isNaN(parsedErrorLogsThread)) {
    throw new Error('ERROR_LOGS_THREAD is not a number');
}

type Config = {
    BOT_TOKEN: string;
    ADMIN_ID: string;
    LOGS_CHAT_ID: string;
    INFO_LOGS_THREAD: number;
    WARNING_LOGS_THREAD: number;
    ERROR_LOGS_THREAD: number;
};

export const config: Config = {
    BOT_TOKEN: botToken,
    ADMIN_ID: adminId,
    LOGS_CHAT_ID: logsChatId,
    INFO_LOGS_THREAD: parsedInfoLogsThread,
    WARNING_LOGS_THREAD: parsedWarningLogsThread,
    ERROR_LOGS_THREAD: parsedErrorLogsThread,
};
