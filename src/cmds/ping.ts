import { ChatInputCommandInteraction, Message } from "discord.js";
import { HybridCommand } from "../common/types/HybridCommand";

const pingFn = (createdTs: number) => {
    const ping = Date.now() - createdTs;
    return `Pong! Network Latency: \`${ping}ms\``;
}

const legacy = async (message: Message) => {
    await message.reply(pingFn(message.createdTimestamp));
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply(pingFn(interaction.createdTimestamp))
}

export const ping: HybridCommand = {
    info: {
        name: "ping",
        description: "Pong! Returns Network Latency"
    },
    legacy: async (message: Message) => await legacy(message),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
}