import { Message } from "discord.js";
import logger from "../util/logger";
import ProfileService from "../services/profileService";
import Scope from "../util/scope";
import Command from "./_Command";
import { getUserLogString } from "../helpers";
import { assetsRepo, inventoryRepo, profileRepo } from "../util/collections";

export const profile = new Command({
    name: "profile",
    desc: "Generates user profile",
    scope: [ Scope.ALL ]
});

profile.run = async (message: Message, args: string[]) => {
    let msg = await message.channel.send(`Generating Profile Card for ${message.author.toString()}...`);
    
    try {
        const { id, username, discriminator } = message.author;
        const userProfile = profileRepo.get(id);
        const userInv = inventoryRepo.get(id);

        const payload = {
            name: username,
            discriminator: discriminator,
            avatar: message.author.displayAvatarURL({ extension: 'png', size: 128, forceStatic: true }),
            xp: userProfile.xp,
            level: userProfile.level,
            bg: assetsRepo.get("backgrounds")[userProfile.bg].src,
            badge1: assetsRepo.get("badges")[userProfile.badge1].src,
            badge2: assetsRepo.get("badges")[userProfile.badge2].src,
            cookies: userInv?.cookies ?? 0,
            coins: userInv?.coins ?? 0,
        }

        logger.info("[Profile] Building Profile");
        const buffer = await ProfileService.getProfileCard(payload);
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