import { GuildMember, TextChannel } from "discord.js";
import { isDevEnv } from "../utils/constants/common";
import { Channels } from "../utils/enums/Channels";
import client from "../utils/client";
import { initializeMemberCollections } from "../services/inventoryService";
import { getChannelMentionFromId } from "../helpers/getChannelMentionFromId";

export const guildMemberAddHandler = async (member: GuildMember) => {
    let greeting =
        `**Welcome to Yuqi's Cookie House :cookie: ${member.toString()}!**\n`
        + `Rules and other information is available in the Server Guide and [our website](https://cookie-pw1t.onrender.com/).\n`
        + `Grab your roles from ${getChannelMentionFromId(Channels.Reception.ROLES)} and ask staff if you need anything!`;

    const channelId = isDevEnv ? Channels.Cookie.TESTING : Channels.Cookieland.GENERAL;
    const channel = await client.channels.fetch(channelId) as TextChannel;
    channel.send(greeting);
    await initializeMemberCollections(member);
}