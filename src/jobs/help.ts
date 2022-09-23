import Scope from "../util/scope";
import Command from "../cmds/_Command";
import { Message } from "discord.js";
import * as jobs from "./index";
import { PREFIX } from "../util/config";

export const help = new Command({
    name: "help",
    desc: "Returns info on every job.",
    scope: [ Scope.STAFF ]
})

help.run = async (message: Message, args: string[]) => {
    const jobList = Object.values(jobs);
    let res = "__**Jobs:**__"
    for(let job of jobList) {
        try {
            const userCanRunCmd = job._canUserInvokeCmd(message.member);
            userCanRunCmd && (res += `\n\`${PREFIX}${job.name}\`\t-\t${job.desc}`);
        } catch (err) {
            continue;
        }
    }

    message.author.send(res);
}