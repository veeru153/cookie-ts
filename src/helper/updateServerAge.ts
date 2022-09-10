import { Client, TextChannel } from "discord.js";
import isDevEnv from "../util/isDevEnv";
import Channels from "../util/channels";
import { Guilds } from "../util/constants";

const updateServerAge = async (client: Client) => {
    const guild = await client.guilds.fetch(Guilds.YUQICORD);
    const ageMs = Date.now() - guild.createdTimestamp;
    const MS_IN_DAY = 86400000
    const age = Math.floor(ageMs/MS_IN_DAY);

    const channelId = isDevEnv() ? Channels.Dev.TESTING : Channels.Reception.INFO;
    const channel = await client.channels.fetch(channelId) as TextChannel;
    channel.setTopic(`:calendar_spiral: Server Age: ${age} Days`);
}

export default updateServerAge;