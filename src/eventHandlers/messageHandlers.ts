import { Message } from "discord.js";
import { PREFIX } from "../util/config";
import * as cmds from "../cmds";
import updateServerAge from "../helper/updateServerAge";
import updateChatXp from "../helper/updateChatXp";
import logger from "../util/logger";

export const messageCreate = async (message: Message) => {
    await updateServerAge();
    if(message.author.bot) return;
    await updateChatXp(message);
    if(!message.content.startsWith(PREFIX)) return;

    let msg = message.content.slice(PREFIX.length).split(" ");
    let cmd = msg.shift();
    let args = [...msg];

    if(Object.keys(cmds).includes(cmd)) {
        const { username, discriminator, id } = message.author;
        logger.info(`[Command] '${cmd}' ran by User : ${username}#${discriminator} (${id})`);
        try {
            (cmds[cmd])._invoke(message, args);
        } catch (err) {
            logger.error(`[Command] ${cmd} - ${err}`);
        }
    }
}

export const messageDelete = async (message: Message) => {
    await updateServerAge();
}

export const messageUpdate = async (message: Message) => {
    await updateServerAge();
}

