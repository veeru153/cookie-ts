import { GuildMember, TextChannel } from "discord.js";
import { isDevEnv } from "../utils/constants";
import { Channels } from "../utils/enums/Channels";
import client from "../utils/client";
import { initializeMemberCollections } from "../services/inventoryService";
import { getChannelMentionFromId } from "../helpers/getChannelMentionFromId";

export const guildMemberAddHandler = async (member: GuildMember) => {
    let greeting = `**Welcome to Yuqi's Cookie House :cookie: ${member.toString()}!**\n`;
    greeting += `Rules and other information is available in ${getChannelMentionFromId(Channels.Reception.INFO)}.\n`
    greeting += `Grab your roles from ${getChannelMentionFromId(Channels.Reception.ROLES)} and ask staff if you need anything!`
    const channelId = isDevEnv ? Channels.Cookie.TESTING : Channels.Cookieland.GENERAL;
    const channel = await client.channels.fetch(channelId) as TextChannel;
    channel.send(greeting);
    await initializeMemberCollections(member);
}