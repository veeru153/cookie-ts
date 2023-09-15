import { Routes, REST } from "discord.js";
import { sendToLogChannel } from "../helpers/sendToLogChannel";
import { CLIENT_ID, TOKEN, isDevEnv } from "../utils/constants/common";
import { log } from "../utils/logger";
import { HybridCommand } from "../utils/types/HybridCommand";
import * as cmds from "../cmds/v2";
import { Guild } from "../utils/enums/Guilds";

const rest = new REST().setToken(TOKEN);

export const syncCommands = async () => {
    try {
        log.info("Syncing Slash Commands...");
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, Guild.YUQICORD),
            { body: Object.values(cmds).map((cmd: HybridCommand) => cmd.info) }
        )
        log.info("Slash Commands Synced!")
    } catch (err) {
        log.error(err, "Error syncing Slash Commands!");
        sendToLogChannel(`Error syncing Slash Commands : ${err}`);
    }
}

export const registerCommands = async () => {
    if (isDevEnv) {
        log.info("Skipping slash command auto registration due to dev environment.");
        return;
    }
    await syncCommands();
}