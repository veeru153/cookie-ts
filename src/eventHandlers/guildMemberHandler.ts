import { GuildMember, TextChannel } from "discord.js";
import client from "../util/client";
import Channels from "../util/channels";
import { mentionChannelWithId } from "../helpers";
import isDevEnv from "../util/isDevEnv";
import { profileRepo, inventoryRepo } from "../util/collections";

export const guildMemberAddHandler = async (member: GuildMember) => {
    const greeting = `**Welcome to Yuqi's Cookie House :cookie: ${member.toString()}!**\nRules and other information is available in ${mentionChannelWithId(Channels.Reception.INFO)}.\nGrab your roles from ${mentionChannelWithId(Channels.Reception.ROLES)} and ask staff if you need anything!`;

    const channelId = isDevEnv() ? Channels.Cookie.TESTING : Channels.Cookieland.GENERAL;
    const channel = await client.channels.fetch(channelId) as TextChannel;
    channel.send(greeting);
    await initMemberCollections(member);
}

const initMemberCollections = async (member: GuildMember) => {
    !profileRepo.get(member.id) && await profileRepo.set(member.id, {
        level: 0,
        xp: 0,
        badge1: "SIGN_YUQI",
        badge2: "IDLE_BLOB",
        bg: "DEFAULT"
    })
    
    inventoryRepo.get(member.id) && await inventoryRepo.set(member.id, {
        cookies: 0,
        lastBaked: -1,
        coins: 0,
        backgrounds: [],
        badges: [],
    });
}