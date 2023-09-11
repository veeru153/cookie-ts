import { HybridCommand } from "../../utils/types/HybridCommand";
import { ChatInputCommandInteraction, Message } from "discord.js";

const pingFn = (createdTs: number) => {
    const ping = Date.now() - createdTs;
    return `Pong! Network Latency: \`${ping}ms\``;
}

const legacy = (message: Message) => {
    message.reply(pingFn(message.createdTimestamp));
}

const slash = (interaction: ChatInputCommandInteraction) => {
    interaction.reply(pingFn(interaction.createdTimestamp))
}

export const ping: HybridCommand = {
    info: {
        name: "ping",
        description: "Pong! Returns Network Latency."
    },
    legacy: legacy,
    slash: slash,
}