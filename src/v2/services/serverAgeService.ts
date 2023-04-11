import { TextChannel } from "discord.js";
import client from "../utils/client";
import { isDevEnv } from "../utils/constants";
import { Channels } from "../utils/enums/Channels";
import { Guilds } from "../utils/enums/Guilds";

export const updateServerAge = async () => {
    const guild = await client.guilds.fetch(Guilds.YUQICORD);
    const ageMs = Date.now() - guild.createdTimestamp;
    const MS_IN_DAY = 86400000
    const age = Math.floor(ageMs / MS_IN_DAY);

    const channelId = isDevEnv ? Channels.Cookie.TESTING : Channels.Reception.INFO;
    const channel = await client.channels.fetch(channelId) as TextChannel;
    channel.setTopic(`:calendar_spiral: Server Age: ${age} Days`);
}