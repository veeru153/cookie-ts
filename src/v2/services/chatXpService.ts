import { Message } from "discord.js";
import { Channels } from "../utils/enums/Channels";
import { profileRepo } from "../utils/repos";
import { getUserLogString } from "../helpers/getUserLogString";
import { log } from "../utils/logger";
import { sendToLogChannel } from "../helpers/sendToLogChannel";
import { UserProfile } from "../utils/schemas/UserProfile";
import { validateAndPatchProfile } from "../helpers/validateAndPatchProfile";

const MULTIPLIER = 5;
const GUARANTEE = 1 / MULTIPLIER;
const LEVEL_LIMIT = 20;

const IGNORED_CHANNELS = [
    Channels.Kitchen.STAFF_BOT,
    Channels.Cookieland.BOTLAND,
    Channels.Cookie.TESTING,
    Channels.Cookie.LOGS,
    Channels.Reception.EMOTES,
] as string[];

export const updateChatXp = async (message: Message) => {
    if (IGNORED_CHANNELS.includes(message.channel.id)) return;
    const { id } = message.author;

    try {
        let userProfile = await profileRepo.get(id);
        userProfile = await validateAndPatchProfile(id, userProfile);

        let userLevel = userProfile.level;
        let userXp = userProfile.xp;

        let updatedXp = Math.floor((Math.random() + GUARANTEE) * MULTIPLIER) + userXp;

        if (updatedXp >= (userLevel + 1) * LEVEL_LIMIT) {
            updatedXp -= ((userLevel + 1) * LEVEL_LIMIT);
            userLevel++;
            log.info(`[Chat XP] ${getUserLogString(message.author)} advanced to Level ${userLevel}`);
            await message.channel.send(`${message.author.toString()} **Level Up!**\nYou just advanced to Level ${userLevel}`);
        }

        userProfile.xp = updatedXp;
        userProfile.level = userLevel;
        await profileRepo.set(id, userProfile);
    } catch (err) {
        log.error(sendToLogChannel(`[Chat XP] Error while updating xp for User : ${getUserLogString(message.author)} : ${err}`));
    }
}