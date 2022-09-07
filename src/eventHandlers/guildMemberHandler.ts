import { Client, GuildMember, TextChannel } from "discord.js";
import Channels from "../util/channels";
import { mentionChannelWithId } from "../helper";
import isDevEnv from "../util/isDevEnv";

export const guildMemberAddHandler = async (client: Client, member: GuildMember) => {
    const greeting = `${member.toString()} Welcome to Yuqi's Cookie House :cookie:!
    Rules and other information is available in ${mentionChannelWithId(Channels.Reception.INFO)}.
    Grab your roles from ${mentionChannelWithId(Channels.Reception.ROLES)} and ask staff if you need anything!`;

    const channelId = isDevEnv() ? Channels.Dev.TESTING : Channels.Cookieland.GENERAL;
    const channel = await client.channels.fetch(channelId) as TextChannel;
    channel.send(greeting);
}