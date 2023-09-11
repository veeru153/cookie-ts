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
        description: "Returns the number of cookies the user has."
    },
    legacy: legacy,
    slash: slash,
}