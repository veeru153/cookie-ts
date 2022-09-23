import { Emoji, GuildEmoji, Message, TextChannel } from "discord.js";
import client from "../util/client";
import Scope from "../util/scope";
import Command from "../cmds/_Command";
import Channels from "../util/channels";
import { Errors, Guilds } from "../util/constants";
import log from "../util/log";

export const updateEmotes = new Command({
    name: "updateEmotes",
    desc: "Force Update Emotes in #emotes",
    scope: [ Scope.STAFF ]
})

updateEmotes.run = async (message: Message, args: string[]) => {
    // TODO: Update channel reference when channel is public
    let channel = await client.channels.resolve(Channels.Reception.EMOTES).fetch();
    if(!channel.isTextBased()) throw new Error(Errors.CHANNEL_TYPE_NOT_TEXT);
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
    const guild = client.guilds.cache.get(Guilds.YUQICORD);
    guild.emojis.cache.forEach((e: GuildEmoji) => {
        if(animated)
            return e.animated && emotes.push(e.toString());
        
        return !e.animated && emotes.push(e.toString());
    });

    return emotes;
}

const sendEmotes = (channel: TextChannel, emoteArr: Emoji[]) => {
    const threshold = 6;
    while(emoteArr.length > 0) {
        const end = Math.min(emoteArr.length, threshold);
        const consumed = emoteArr.splice(0, end);
        channel.send(consumed.join("  "));
    }
}