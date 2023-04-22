import { Message } from "discord.js";
import { getUserLogString } from "../helpers/getUserLogString";
import { updateChatXp } from "../services/chatXpService";
import logger from "../utils/logger";
import { PREFIX } from "../utils/constants";
import * as cmds from "../cmds";
import { updateGuildAge } from "../services/guildService";
import { Command } from "../entities/Command";

export const messageCreate = async (message: Message) => {
    await updateGuildAge();
    if (message.author.bot) return;
    await updateChatXp(message);
    if (!message.content.startsWith(PREFIX)) return;

    let msg = message.content.slice(PREFIX.length).split(" ");
    let cmd = msg.shift();
    let args = [...msg];

    if (Object.keys(cmds).includes(cmd)) {
        logger.info(`[Command] '${cmd}' ran by User : ${getUserLogString(message.author)}`);
        try {
            (cmds[cmd] as Command).run(message, args);
        } catch (err) {
            logger.error(`[Command] ${cmd} - ${err}`);
        }
    }
}

export const messageDelete = async (message: Message) => {
    await updateGuildAge();
}

export const messageUpdate = async (message: Message) => {
    await updateGuildAge();
}

