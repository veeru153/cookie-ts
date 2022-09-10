import { Client, Message } from "discord.js";
import Scope from "../util/scope";
import Command from "./_Command";
import * as jobs from "../jobs";

export const job = new Command({
    name: "job",
    desc: "Handle Server Jobs",
    scope: [ Scope.STAFF ]
})

job.run = async (client: Client, message: Message, args: string[]) => {
    const job = args[0];
    args.shift();
    if(Object.keys(jobs).includes(job)) {
        message.channel.send(`Job ran: \`${job}\``);
        (jobs[job])._invoke(client, message, args);
    }
}
