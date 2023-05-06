import { Message } from "discord.js";
import { Channels } from "../utils/enums/Channels";
import { profileRepo } from "../utils/repos";
import { getUserLogString } from "../helpers/getUserLogString";
import { log } from "../utils/logger";
import { sendToLogChannel } from "../helpers/sendToLogChannel";
import { validateAndPatchProfile } from "../helpers/validateAndPatchProfile";
import { BOOSTER_MULTIPLIER } from "../utils/constants";

const MULTIPLIER = 5;
const GUARANTEE = 1 / MULTIPLIER;
const LEVEL_LIMIT = 20;


const IGNORED_CHANNELS = [
    Channels.Reception.EMOTES,
    Channels.Kitchen.STAFF_BOT,
    Channels.Cookieland.BOTLAND,
    Channels.Cookie.TESTING,
    Channels.Cookie.LOGS,
    Channels.Cookie.EMOTES_TEST,
    Channels.Cookie.ASSET_LIBRARY,
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

        if (message.member.roles.premiumSubscriberRole) {
            updatedXp = Math.round(updatedXp * BOOSTER_MULTIPLIER);
        }

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