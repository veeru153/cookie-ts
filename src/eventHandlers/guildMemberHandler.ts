import { GuildMember, TextChannel } from "discord.js";
import client from "../util/client";
import Channels from "../util/channels";
import { mentionChannelWithId } from "../helpers";
import isDevEnv from "../util/isDevEnv";

export const guildMemberAddHandler = async (member: GuildMember) => {
    const greeting = `**Welcome to Yuqi's Cookie House :cookie: ${member.toString()}!**\nRules and other information is available in ${mentionChannelWithId(Channels.Reception.INFO)}.\nGrab your roles from ${mentionChannelWithId(Channels.Reception.ROLES)} and ask staff if you need anything!`;

    const channelId = isDevEnv() ? Channels.Cookie.TESTING : Channels.Cookieland.GENERAL;
    const channel = await client.channels.fetch(channelId) as TextChannel;
    channel.send(greeting);
}