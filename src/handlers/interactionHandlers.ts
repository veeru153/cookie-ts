import { Interaction, REST, Routes } from "discord.js";
import { updateGuildAge } from "../services/guildService";
import { CLIENT_ID, TOKEN, isDevEnv } from "../utils/constants/common";
import { Guild } from "../utils/enums/Guilds";
import * as cmds from "../cmds/v2/index";
import { log } from "../utils/logger";
import { sendToLogChannel } from "../helpers/sendToLogChannel";
import { HybridCommand } from "../utils/types/HybridCommand";

const rest = new REST().setToken(TOKEN);

export const registerCommands = async () => {
    try {
        log.info("Registering Slash Commands...");
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, Guild.YUQICORD),
            { body: Object.values(cmds).map((cmd: HybridCommand) => cmd.info) }
        )
        log.info("Slash Commands Registered!")
    } catch (err) {
        log.error(err, "Error registering Slash Commands!");
        sendToLogChannel(`Error registering Slash Commands : ${err}`);
    }
}

export const syncCommands = async () => {
    if (isDevEnv) {
        log.info("Skipping auto sync due to dev environment.");
        return;
    }

    await registerCommands();
}

export const interactionCreate = async (interaction: Interaction) => {
    await updateGuildAge();

    if (interaction.isChatInputCommand()) {
        const cmd = cmds[interaction.commandName] as HybridCommand;
        cmd.slash(interaction);
    }
}