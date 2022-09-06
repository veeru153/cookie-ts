import { Message, Client } from "discord.js/typings";
import Command from "./_Command";
import Scope from "../util/scope";

export const echo = new Command({
    name: "echo",
    desc: "Echoes/reposts a message.",
    scope: [ Scope.STAFF ]
})

echo.run = async (client: Client, message: Message, args: string[]) => {
    const isDiffChannel = ["-c", "--channel"].includes(args[0]);
    let channel = null;
    if(isDiffChannel) {
        channel = message.mentions.channels.first();
        args.splice(0, 2);
    } else {
        channel = message.channel;
    }

    const isAnon = ["-a", "--anon"].includes(args[0]);
    let prefix = `**${message.author.tag}** said:`;
    if(isAnon) {
        args.shift();
        prefix = "";
    }

    const msg = args.join(" "); 
    channel.send(`${prefix} ${msg}`);
}