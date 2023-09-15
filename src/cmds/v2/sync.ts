import { syncCommands } from "../../services/interactionService";
import { HybridCommand } from "../../utils/types/HybridCommand";
import { ChatInputCommandInteraction, Message } from "discord.js";

const syncFn = async () => {
    await syncCommands();
    return "Commands synchronized!";
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