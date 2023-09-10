import { Message } from "discord.js";
import { getUserLogString } from "../helpers/getUserLogString";
import { updateChatXp } from "../services/chatXpService";
import { PREFIX, devIdList, isDevEnv } from "../utils/constants/common";
import * as cmds from "../cmds";
import { updateGuildAge } from "../services/guildService";
import { Command } from "../entities/Command";
import { log } from "../utils/logger";
import { sendToLogChannel } from "../helpers/sendToLogChannel";

export const messageCreate = async (message: Message) => {
    await updateGuildAge();
    if (message.author.bot) return;
    if (isDevEnv && !devIdList.includes(message.author.id)) return;
    await updateChatXp(message);
    if (!message.content.startsWith(PREFIX)) return;

    let msg = message.content.slice(PREFIX.length).split(" ");
    let cmd = msg.shift();
    let args = [...msg];

    if (Object.keys(cmds).includes(cmd)) {
        log.info(`[Command] '${cmd}' ran by User : ${getUserLogString(message.author)}`);
        try {
            (cmds[cmd] as Command).run(message, args);
        } catch (err) {
            log.error(sendToLogChannel(`[Command] Error while running ${cmd} by User : ${getUserLogString(message.author)} : ${err}`));
        }
    }
}

export const messageDelete = async (message: Message) => {
    await updateGuildAge();
}

export const messageUpdate = async (message: Message) => {
    await updateGuildAge();
}

