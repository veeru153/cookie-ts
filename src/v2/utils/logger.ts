import { TextChannel } from "discord.js";
import pino from "pino";
import client from "./client";
import { Channels } from "./enums/Channels";
import { isDevEnv } from "./constants";

const sendToLogChannel = (log: string) => {
    const channelId = isDevEnv ? Channels.Cookie.DEV_LOGS : Channels.Cookie.LOGS;
    client.channels.fetch(channelId).then((channel: TextChannel) => {
        channel.send(log);
    })
}

class Logger {
    _logger = pino();

    info(log: string) {
        sendToLogChannel(log);
        this._logger.info(log);
    }

    error(log: string) {
        sendToLogChannel("**[ERROR]** " + log);
        this._logger.error(log);
    }

    devInfo(log: string) {
        this._logger.info(log);
    }

    devError(log: string) {
        this._logger.error(log);
    }
}

const logger = new Logger();

export default logger;