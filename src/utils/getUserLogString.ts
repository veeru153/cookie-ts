import { User } from "discord.js";

export const getUserLogString = (user: User) => {
    const { username, discriminator, id } = user;
    if (discriminator === "0") {
        return `${username} (${id})`
    }
    return `${username}#${discriminator} (${id})`;
}