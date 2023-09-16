import { TextChannel } from "discord.js";
import client from "../common/client";
import { isDevEnv } from "../common/constants/common";
import { Channels } from "../common/enums/Channels";

export const sendToLogChannel = (log: string) => {
    const channelId = isDevEnv ? Channels.Cookie.DEV_LOGS : Channels.Cookie.LOGS;
    client.channels.fetch(channelId).then((channel: TextChannel) => {
        channel.send(log);
    })
    return log;
}