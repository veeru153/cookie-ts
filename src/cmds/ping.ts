import { Client, Message } from "discord.js";
import Scope from "../util/scope";
import Command from "./_Command";

export const ping = new Command({
    name: "ping",
    desc: "Pong! Returns Network Latency.",
    scope: [ Scope.ALL ]
})

ping.run = async (client: Client, message: Message, args: string[]) => {
    const ping = Date.now() - message.createdTimestamp;
    message.channel.send(`Pong! Network Latency: \`${ping}ms\``);
}
