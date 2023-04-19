import { Message } from "discord.js";
import { Channels } from "../utils/enums/Channels";
import { profileRepo } from "../utils/repos";
import logger from "../utils/logger";
import { getUserLogString } from "../helpers/getUserLogString";

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
        const userProfile = profileRepo.get(id);

        if (userProfile == null) {
            logger.error(`[ChatXpService] User : (${id}) is Null`)
            await profileRepo.set(id, {
                xp: Math.floor((Math.random() + GUARANTEE) * MULTIPLIER),
                level: 0,
            })
            return;
        }

        let userLevel = userProfile.level;
        let userXp = userProfile.xp;

        // TODO: chat xp formula
        let updatedXp = Math.floor((Math.random() + GUARANTEE) * MULTIPLIER) + userXp;

        if (updatedXp >= (userLevel + 1) * LEVEL_LIMIT) {
            updatedXp -= ((userLevel + 1) * LEVEL_LIMIT);
            userLevel++;
            logger.info(`[Chat XP] ${getUserLogString(message.author)} advanced to Level ${userLevel}`);
            await message.channel.send(`${message.author.toString()} **Level Up!**\nYou just advanced to Level ${userLevel}`);
        }

        await profileRepo.set(id, {
            xp: updatedXp,
            level: userLevel,
        })
    } catch (err) {
        logger.error(`[Chat XP] ${err}`);
    }
}