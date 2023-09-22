import { Routes, REST } from "discord.js";
import { sendToLogChannel } from "../utils/sendToLogChannel";
import { CLIENT_ID, TOKEN, isDevEnv } from "../common/constants/common";
import { log } from "../common/logger";
import { HybridCommand } from "../common/types/HybridCommand";
import * as cmds from "../cmds";
import { Guild } from "../common/enums/Guilds";

const rest = new REST().setToken(TOKEN);

export const syncCommands = async () => {
    try {
        log.info("Syncing Slash Commands...");
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, Guild.YUQICORD),
            { body: Object.values(cmds).map((cmd: HybridCommand) => cmd.info) }
        )
        log.info("Slash Commands Synced!");
        return true;
    } catch (err) {
        log.error(err, "Error syncing Slash Commands!");
        sendToLogChannel(`Error syncing Slash Commands : ${err}`);
        return false;
    }
}

export const registerCommands = async () => {
    if (isDevEnv) {
        log.info("Skipping slash command auto registration due to dev environment.");
        return;
    }
    await syncCommands();
}