import { Message } from "discord.js";
import { Channels } from "../utils/enums/Channels";
import { profileRepo } from "../utils/repos";
import { getUserLogString } from "../helpers/getUserLogString";
import { log } from "../utils/logger";
import { sendToLogChannel } from "../helpers/sendToLogChannel";
import { validateAndPatchProfile } from "../helpers/validateAndPatchProfile";
import { isDevEnv } from "../utils/constants";

const BOOSTER_MULTIPLIER = 1.25
const EVENT_MULTIPLIER = 0;
const PROMOTION_MULTIPLIER = 0;

const CLIMB_CONSTANT = 0.004;
const CLIMB_POWER = 2.5;
const CLIMB_BASE = 10;
const FINAL_XP_CAP = 400;

export const updateChatXp = async (message: Message) => {
    if (!isDevEnv) IGNORED_CHANNELS.push(Channels.Cookie.TESTING)
    if (IGNORED_CHANNELS.includes(message.channel.id)) return;
    const { id } = message.author;

    try {
        let userProfile = await profileRepo.get(id);
        userProfile = await validateAndPatchProfile(id, userProfile);

        let userLevel = userProfile.level;
        let userXp = userProfile.xp;
        // TODO: add userEquipedMultiplier once implemented
        let userEquipedMultipler = 0;

        let mutliplierSum = EVENT_MULTIPLIER + PROMOTION_MULTIPLIER + userEquipedMultipler;
        let xpDelta = 1 + mutliplierSum;

        if (message.member.roles.premiumSubscriberRole) {
            xpDelta = xpDelta * BOOSTER_MULTIPLIER;
        }

        let updatedXp = userXp + xpDelta;
        const xpCapAtLevel = Math.round(((CLIMB_CONSTANT * Math.pow(userLevel, CLIMB_POWER))) + CLIMB_BASE);
        const xpCap = Math.min(xpCapAtLevel, FINAL_XP_CAP);
        if (updatedXp >= xpCap) {
            updatedXp -= xpCap;
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

const IGNORED_CHANNELS = [
    Channels.Reception.EMOTES,
    Channels.Kitchen.STAFF_BOT,
    Channels.Cookieland.BOTLAND,
    Channels.Cookie.TESTING,
    Channels.Cookie.LOGS,
    Channels.Cookie.EMOTES_TEST,
    Channels.Cookie.ASSET_LIBRARY,
] as string[];