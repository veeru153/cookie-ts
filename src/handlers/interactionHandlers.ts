import { Interaction } from "discord.js";
import { updateGuildAge } from "../services/guildService";
import * as cmds from "../cmds/v2/index";
import { log } from "../utils/logger";
import { sendToLogChannel } from "../helpers/sendToLogChannel";
import { HybridCommand } from "../utils/types/HybridCommand";
import { canMemberRunCmdV2 } from "../helpers/canMemberRunCmd";
import { CookieException } from "../utils/CookieException";
import { getUserLogString } from "../helpers/getUserLogString";

export const interactionCreate = async (interaction: Interaction) => {
    await updateGuildAge();

    if (!interaction.inCachedGuild()) {
        log.warn("Interaction in uncached guild. Skipping...");
        return;
    }

    if (interaction.isChatInputCommand()) {
        const { member, commandName } = interaction;
        try {
            const cmd: HybridCommand = cmds[commandName];
            if (canMemberRunCmdV2(member, cmd)) {
                log.info(`[Slash Command] '${commandName}' ran by User : ${getUserLogString(interaction.member.user)}`);
                cmd.slash(interaction);
            } else {
                log.warn(`Member: ${member.toString()} could not run command: ${commandName}. Reason: Scope`);
                interaction.reply("You don't have permissions to run this command");
            }
        } catch (err) {
            if (err instanceof CookieException) {
                interaction.reply(err.message);
            } else {
                log.error(err, sendToLogChannel(`Error running command: ${commandName} by member: ${member.toString()}`));
                interaction.reply("An error occurred!");
            }
        }
    }
}