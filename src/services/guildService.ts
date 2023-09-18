import { Emoji, GuildEmoji, TextChannel } from "discord.js";
import client from "../common/client";
import { isDevEnv } from "../common/constants/common";
import { Channels } from "../common/enums/Channels";
import { Guild } from "../common/enums/Guilds";
import { Errors } from "../common/enums/Errors";
import { CookieException } from "../common/CookieException";
import { log } from "../common/logger";
import { sendToLogChannel } from "../utils/sendToLogChannel";

let lastUpdatedGuildAge = -1;

export const updateGuildAge = async () => {
    const guild = await client.guilds.fetch(Guild.YUQICORD);
    const ageMs = Date.now() - guild.createdTimestamp;
    const MS_IN_DAY = 86400000
    const age = Math.floor(ageMs / MS_IN_DAY);

    if (lastUpdatedGuildAge === age)
        return;

    const channelId = isDevEnv ? Channels.Cookie.TESTING : Channels.Reception.ANNOUNCEMENTS;
    const channel = await client.channels.fetch(channelId) as TextChannel;
    try {
        log.info(`Updating Guild Age: ${age} Days`);
        await channel.setTopic(`:calendar_spiral: Server Age: ${age} Days`);
        lastUpdatedGuildAge = age;
    } catch (err) {
        log.error(err, "Error updating Guild Age");
        sendToLogChannel(`Error updating Guild Age: ${age} Days.\nError: ${err}`);
    }
}

export const updateEmotes = async () => {
    const channelId = isDevEnv ? Channels.Cookie.EMOTES_TEST : Channels.Reception.EMOTES;
    let channel = await client.channels.resolve(channelId).fetch();
    if (!channel.isTextBased())
        throw new CookieException(Errors.CHANNEL_TYPE_NOT_TEXT);
    channel = (channel as TextChannel);
    await clearChannel(channel);

    const emotes = await getEmotes();
    await sendEmotes(channel, emotes);
    const animatedEmotes = await getEmotes(true);
    await sendEmotes(channel, animatedEmotes);
}

const clearChannel = async (channel: TextChannel) => {
    const msgs = await channel.messages.fetch();
    msgs.forEach(async msg => {
        if (!msg.deletable) {
            log.warn(sendToLogChannel(`Cannot delete message in channel: ${channel.toString()}`));
        } else {
            await msg.delete();
        }
    })
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

const sendEmotes = async (channel: TextChannel, emoteArr: Emoji[]) => {
    const threshold = 6;
    while (emoteArr.length > 0) {
        const end = Math.min(emoteArr.length, threshold);
        const consumed = emoteArr.splice(0, end);
        await channel.send(consumed.join("  "));
    }
}