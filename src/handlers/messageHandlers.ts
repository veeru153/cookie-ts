import { Message } from "discord.js";
import { getUserLogString } from "../utils/getUserLogString";
import { updateChatXp } from "../services/chatXpService";
import { PREFIX, DEV_ENV_WHITELIST_IDS, isDevEnv } from "../common/constants/common";
import * as cmds from "../cmds";
import { updateGuildAge } from "../services/guildService";
import { log } from "../common/logger";
import { sendToLogChannel } from "../utils/sendToLogChannel";
import { HybridCommand } from "../common/types/HybridCommand";
import { canMemberRunCmd } from "../utils/canMemberRunCmd";
import { CookieException } from "../common/CookieException";

export const messageCreate = async (message: Message) => {
    await updateGuildAge();
    if (message.author.bot) return;
    if (isDevEnv && !DEV_ENV_WHITELIST_IDS.includes(message.author.id)) return;
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
        if (canMemberRunCmd(message.member, cmd)) {
            await cmd.legacy(message, args);
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

