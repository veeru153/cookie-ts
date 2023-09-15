import { Routes, REST } from "discord.js";
import { sendToLogChannel } from "../helpers/sendToLogChannel";
import { CLIENT_ID, TOKEN, isDevEnv } from "../utils/constants/common";
import { log } from "../utils/logger";
import { HybridCommand } from "../utils/types/HybridCommand";
import * as cmds from "../cmds/v2";
import { Guild } from "../utils/enums/Guilds";

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