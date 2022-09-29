import { Message } from "discord.js";
import logger from "../util/logger";
import ProfileService from "../services/profileService";
import Scope from "../util/scope";
import Command from "./_Command";
import { getUserLogString } from "../helpers";
import { assetsRepo, inventoryRepo, profileRepo } from "../util/collections";
import { UserProfile } from "../util/collectionTypes";
import { UserInventory } from "../util/collectionTypes";

let userInv: UserInventory;
let userProfile: UserProfile;

export const profile = new Command({
    name: "profile",
    desc: "[BETA] Generates a User Profile Card",
    scope: [ Scope.ALL ]
});

profile.run = async (message: Message, args: string[]) => {
    userInv = inventoryRepo.get(message.author.id) as UserInventory;
    userProfile = profileRepo.get(message.author.id) as UserProfile;

    const option = args.shift();
    try {
        switch(option) {
            case "set":
                customizeProfile(message, args);
                break;
            default:
                getProfileCard(message);
        }
    } catch (err) {
        message.reply("An error occurred!");
        logger.error(`[Profile] Error for User : ${getUserLogString(message.author)} - ${err}`);
    }
}

const customizeProfile = async (message: Message, arr: string[]) => {
    let res = "";

    if(arr.length == 0 || (arr.length) % 2 != 0) {
        await message.reply("Incorrect arguments! Check your inputs");
        return;
    }

    for(let i = 0; i < arr.length; i+=2) {
        const key = arr[i];
        const value = arr[i + 1];
        res += await __equipItem(key, value);
    }
    
    await profileRepo.set(message.author.id, userProfile);
    await message.reply(res);
}

const __equipItem = async (key: string, value: string) => {
    const { badges, backgrounds } = userInv;
    if(!["badge1", "badge2", "background"].includes(key))
        return `${key} - Invalid Key\n`;

    if(["badge1", "badge2"].includes(key) && !badges.includes(value)) 
        return `\`${key}\` - \`${value}\` not found in owned badges\n`;

    if((key == "background" || key == "bg") && !backgrounds.includes(value)) {
        key = "bg";
        return `\`${key}\` - \`${value}\` not found in owned backgrounds\n`;
    }

    userProfile[key] = value;
    return `Updated \`${key}\` to \`${value}\`\n`;
}

const getProfileCard = async (message: Message) => {
    let msg = await message.channel.send(`Generating Profile Card for ${message.author.toString()}...`);
    const {id, username, discriminator } = message.author;
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
}