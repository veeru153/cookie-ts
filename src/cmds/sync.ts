import { ChatInputCommandInteraction, Message } from "discord.js";
import { syncCommands } from "../services/interactionService";
import { HybridCommand } from "../common/types/HybridCommand";

const syncFn = async () => {
    const synced = await syncCommands();
    return synced ? "Commands synchronized!" : "Error syncing Commands!";
}

const legacy = async (message: Message) => {
    await message.reply(await syncFn());
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply(await syncFn())
}

export const sync: HybridCommand = {
    info: {
        name: "sync",
        description: "Synchronize Slash Commands"
    },
    legacy: async (message: Message) => await legacy(message),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
}