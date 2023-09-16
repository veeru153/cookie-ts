import { Interaction } from "discord.js";
import { updateGuildAge } from "../services/guildService";
import * as cmds from "../cmds";
import { log } from "../common/logger";
import { sendToLogChannel } from "../utils/sendToLogChannel";
import { HybridCommand } from "../common/types/HybridCommand";
import { canMemberRunCmd } from "../utils/canMemberRunCmd";
import { CookieException } from "../common/CookieException";
import { getUserLogString } from "../utils/getUserLogString";

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
            if (canMemberRunCmd(member, cmd)) {
                log.info(`[Slash Command] '${commandName}' ran by User : ${getUserLogString(interaction.member.user)}`);
                await cmd.slash(interaction);
            } else {
                log.warn(`Member: ${member.toString()} could not run command: ${commandName}. Reason: Scope`);
                interaction.reply("You don't have permissions to run this command");
            }
        } catch (err) {
            if (err instanceof CookieException) {
                if (interaction.deferred) {
                    interaction.editReply(err.message);
                } else {
                    interaction.reply(err.message);
                }
            } else {
                log.error(err, sendToLogChannel(`Error running command: ${commandName} by member: ${member.toString()}`));
                if (interaction.deferred) {
                    interaction.editReply("An error occurred!");
                } else {
                    interaction.reply("An error occurred!");
                }
            }
        }
    }
}