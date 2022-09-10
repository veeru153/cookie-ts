import { Message } from "discord.js";
import logger from "../util/logger";
import Channels from "../util/channels";
import collections from "../util/collections";

const MULTIPLIER = 5;
const GUARANTEE = 1/MULTIPLIER;
const LEVEL_LIMIT = 20;

const IGNORED_CHANNELS = [
    Channels.Kitchen.STAFF_BOT,
    Channels.Cookieland.BOTLAND,
    Channels.Cookie.TESTING,
    Channels.Cookie.LOGS,
    Channels.Cookie.EMOTES,
] as string[];

const updateChatXp = async (message: Message) => {
    if(IGNORED_CHANNELS.includes(message.channel.id)) return;
    const { username, discriminator, id } = message.author;

    try {
        const userRank = collections.RANKS.doc(id);
        
        // TODO: Work on chat xp formula
        if(!(await userRank.get()).exists) {
            userRank.set({
                xp: Math.floor((Math.random() + GUARANTEE) * MULTIPLIER),
                level: 0,
            })
            return;
        }
    
        let userLevel = (await userRank.get()).data().level;
        let userXp = (await userRank.get()).data().xp;
    
        // TODO: chat xp formula
        let updatedXp = Math.floor((Math.random() + GUARANTEE) * MULTIPLIER) + userXp;
    
        if(updatedXp >= (userLevel + 1) * LEVEL_LIMIT) {
            updatedXp -= (userLevel - 1) * LEVEL_LIMIT;
            userLevel++;
            logger.info(`[Chat XP] ${username}#${discriminator} (${id}) advanced to Level ${userLevel}`);
            const msg = await message.channel.send(`${message.author.toString()} **Level Up!**\nYou just advanced to Level ${userLevel}`);
        }
    
        userRank.update({
            xp: updatedXp,
            level: userLevel,
        })
    } catch (err) {
        logger.error(`[Chat XP] ${err}`);
    }

}

export default updateChatXp;