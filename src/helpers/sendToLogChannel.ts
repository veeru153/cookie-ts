import { TextChannel } from "discord.js";
import client from "../utils/client";
import { isDevEnv } from "../utils/constants";
import { Channels } from "../utils/enums/Channels";

export const sendToLogChannel = (log: string) => {
    const channelId = isDevEnv ? Channels.Cookie.DEV_LOGS : Channels.Cookie.LOGS;
    client.channels.fetch(channelId).then((channel: TextChannel) => {
        channel.send(log);
    })
    return log;
}