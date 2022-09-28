import { Message } from "discord.js";
import logger from "../util/logger";
import ProfileService from "../services/profileService";
import Scope from "../util/scope";
import Command from "./_Command";
import { getUserLogString } from "../helpers";

export const profile = new Command({
    name: "profile",
    desc: "Generates user profile",
    scope: [ Scope.ALL ]
});

profile.run = async (message: Message, args: string[]) => {
    let msg = await message.channel.send(`Generating Profile Card for ${message.author.toString()}...`);

    try {
        const buffer = await ProfileService.getProfileCard();
        msg.deletable && msg.delete();
        message.reply({
            files: [{
                attachment: buffer,
                name: `Profile_${message.author.id}.png`
            }]
        })
    } catch (err) {
        msg.deletable && msg.delete();
        message.reply("An error occurred!");
        logger.error(`[Profile] Error generating profile card for User : ${getUserLogString(message.author)} - ${err}`);
    }
}