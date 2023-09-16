import { Message } from "discord.js";
import { getUserLogString } from "../helpers/getUserLogString";
import { updateChatXp } from "../services/chatXpService";
import { PREFIX, devIdList, isDevEnv } from "../utils/constants/common";
import * as cmds from "../cmds/v2";
import { updateGuildAge } from "../services/guildService";
import { Command } from "../entities/Command";
import { log } from "../utils/logger";
import { sendToLogChannel } from "../helpers/sendToLogChannel";
import { HybridCommand } from "../utils/types/HybridCommand";
import { canMemberRunCmdV2 } from "../helpers/canMemberRunCmd";
import { CookieException } from "../utils/CookieException";

export const messageCreate = async (message: Message) => {
    await updateGuildAge();
    if (message.author.bot) return;
    if (isDevEnv && !devIdList.includes(message.author.id)) return;
    await updateChatXp(message);
    if (!message.content.startsWith(PREFIX)) return;

    let msg = message.content.slice(PREFIX.length).split(" ");
    let commandName = msg.shift();
    let args = [...msg];

    const cmd: HybridCommand = cmds[commandName]
    if (cmd == null) {
        return;
    }

    try {
        log.info(`[Command] '${commandName}' ran by User : ${getUserLogString(message.author)}`);
        if (canMemberRunCmdV2(message.member, cmd)) {
            cmd.legacy(message, args);
        }
    } catch (err) {
        if (err instanceof CookieException) {
            message.reply(err.message);
        } else {
            log.error(err, sendToLogChannel(`[Command] Error while running ${commandName} by User : ${getUserLogString(message.author)}`));
            message.reply("An error occurred :(");
        }
    }
}

export const messageDelete = async (message: Message) => {
    await updateGuildAge();
}

export const messageUpdate = async (message: Message) => {
    await updateGuildAge();
}

