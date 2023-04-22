import { Emoji, GuildEmoji, Message, TextChannel } from "discord.js";
import { Command } from "../entities/Command";
import { Channels } from "../utils/enums/Channels";
import client from "../utils/client";
import Scope from "../utils/enums/Scope";
import { Errors } from "../utils/enums/Errors";
import { Guild } from "../utils/enums/Guilds";

export const updateEmotesJob = async () => {
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

export const updateEmotes = new Command({
    name: "updateEmotes",
    desc: "Force Update Emotes in #emotes",
    scope: [Scope.STAFF],
    fn: updateEmotesJob
})