import { User } from "discord.js";

export const mentionChannelWithId = (channelId: string): string => {
    return `<#${channelId}>`;
}

export const getUserLogString = (user: User) => {
    const { username, discriminator, id } = user;
    return `${username}#${discriminator} (${id})`;
}