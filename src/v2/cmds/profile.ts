import { Message } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import logger from "../utils/logger";
import { getUserLogString } from "../helpers/getUserLogString";
import { Errors } from "../utils/enums/Errors";
import { customizeProfile, getProfileCard } from "../services/profileService";
import { ShopItemType } from "../utils/schemas/ShopItem";

const profileFn = async (message: Message, args: string[]) => {
    const option = args[0];

    try {
        if (option === "set") {
            await updateProfile(message, args);
        } else {
            await getProfile(message);
        }
    } catch (err) {
        if (err.message) {
            message.reply(err.message);
            return;
        }
        message.reply("An error occurred!");
        logger.error(`[Profile] Error for User : ${getUserLogString(message.author)} - ${err}`)
    }
}

const updateProfile = async (message: Message, args: string[]) => {
    args.shift();
    if (args.length !== 2)
        throw new Error(Errors.INSUFFICIENT_ARGS);
    const key = args[0];
    const value = args[1];
    await customizeProfile(message.author.id, key as ShopItemType, value);
    await message.reply('Profile updated');
}

const getProfile = async (message: Message) => {
    const ack = await message.channel.send(`Generating Profile Card for ${message.author.toString()}...`);
    const card = await getProfileCard(message);
    ack.deletable && await ack.delete();
    await message.reply({
        files: [{
            attachment: card,
            name: `Profile_${message.author.id}.png`
        }]
    })
}

export const profile = new Command({
    name: "profile",
    desc: "[BETA] Get or Update Profile.",
    scope: [Scope.ALL],
    fn: profileFn
});