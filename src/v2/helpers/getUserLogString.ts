import { User } from "discord.js";

export const getUserLogString = (user: User) => {
    const { username, discriminator, id } = user;
    return `${username}#${discriminator} (${id})`;
}