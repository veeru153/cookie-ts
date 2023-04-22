import { Interaction, Message } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";

const pingFn = (message: Message) => {
    const ping = Date.now() - message.createdTimestamp;
    message.reply(`Pong! Network Latency: \`${ping}ms\``);
}

export const ping = new Command({
    name: "ping",
    desc: "Pong! Returns Network Latency.",
    scope: [Scope.ALL],
    fn: pingFn
});