import { Message } from "discord.js";
import logger from "../util/logger";
import Channels from "../util/channels";
import { getUserLogString } from "../helpers";
import { ranksRepo } from "../util/collections_v2";

const MULTIPLIER = 5;
const GUARANTEE = 1/MULTIPLIER;
const LEVEL_LIMIT = 20;

const IGNORED_CHANNELS = [
    Channels.Kitchen.STAFF_BOT,
    Channels.Cookieland.BOTLAND,
    Channels.Cookie.TESTING,
    Channels.Cookie.LOGS,
    Channels.Reception.EMOTES,
] as string[];

const updateChatXp = async (message: Message) => {
    if(IGNORED_CHANNELS.includes(message.channel.id)) return;
    const { id } = message.author;

    try {
        const userRank = await ranksRepo.get(id);

        if(userRank == null) {
            console.log("user is null")
            ranksRepo.set(id, {
                xp: Math.floor((Math.random() + GUARANTEE) * MULTIPLIER),
                level: 0,
            })
            return;
        }

        let userLevel = userRank.level;
        let userXp = userRank.xp;
    
        // TODO: chat xp formula
        let updatedXp = Math.floor((Math.random() + GUARANTEE) * MULTIPLIER) + userXp;
    
        if(updatedXp >= (userLevel + 1) * LEVEL_LIMIT) {
            updatedXp -= ((userLevel + 1) * LEVEL_LIMIT);
            userLevel++;
            logger.info(`[Chat XP] ${getUserLogString(message.author)} advanced to Level ${userLevel}`);
            const msg = await message.channel.send(`${message.author.toString()} **Level Up!**\nYou just advanced to Level ${userLevel}`);
        }

        ranksRepo.set(id, {
            xp: updatedXp,
            level: userLevel,
        })
    } catch (err) {
        logger.error(`[Chat XP] ${err}`);
    }

}

export default updateChatXp;