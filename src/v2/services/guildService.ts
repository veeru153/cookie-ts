import { Emoji, GuildEmoji, TextChannel } from "discord.js";
import client from "../utils/client";
import { isDevEnv } from "../utils/constants";
import { Channels } from "../utils/enums/Channels";
import { Guild } from "../utils/enums/Guilds";
import { Errors } from "../utils/enums/Errors";

export const updateGuildAge = async () => {
    const guild = await client.guilds.fetch(Guild.YUQICORD);
    const ageMs = Date.now() - guild.createdTimestamp;
    const MS_IN_DAY = 86400000
    const age = Math.floor(ageMs / MS_IN_DAY);

    const channelId = isDevEnv ? Channels.Cookie.TESTING : Channels.Reception.INFO;
    const channel = await client.channels.fetch(channelId) as TextChannel;
    channel.setTopic(`:calendar_spiral: Server Age: ${age} Days`);
}

export const updateEmotes = async () => {
    let channel = await client.channels.resolve(Channels.Reception.EMOTES).fetch();
    if (!channel.isTextBased()) throw new Error(Errors.CHANNEL_TYPE_NOT_TEXT);
    channel = (channel as TextChannel);
    await clearChannel(channel);

    const emotes = await getEmotes();
    sendEmotes(channel, emotes);
    const animatedEmotes = await getEmotes(true);
    sendEmotes(channel, animatedEmotes);
}

const clearChannel = async (channel: TextChannel) => {
    const msgs = await channel.messages.fetch();
    await channel.bulkDelete(msgs);
}

const getEmotes = async (animated = false) => {
    const emotes = [];
    const guild = client.guilds.cache.get(Guild.YUQICORD);
    guild.emojis.cache.forEach((e: GuildEmoji) => {
        if (animated)
            return e.animated && emotes.push(e.toString());

        return !e.animated && emotes.push(e.toString());
    });

    return emotes;
}

const sendEmotes = (channel: TextChannel, emoteArr: Emoji[]) => {
    const threshold = 6;
    while (emoteArr.length > 0) {
        const end = Math.min(emoteArr.length, threshold);
        const consumed = emoteArr.splice(0, end);
        channel.send(consumed.join("  "));
    }
}