import { Message } from "discord.js";
import Scope from "../util/scope";
import Command from "./_Command";
import * as cmds from "./index";
import { PREFIX } from "../util/config";

export const help = new Command({
    name: "help",
    desc: "Returns info on every command.",
    scope: [ Scope.ALL ] 
})

help.run = async (message: Message, args: string[]) => {
    const cmdList = Object.values(cmds);
    let res = "__**Commands:**__"
    for(let cmd of cmdList) {
        try {
            const userCanRunCmd = cmd._canUserInvokeCmd(message.member);
            userCanRunCmd && (res += `\n\`${PREFIX}${cmd.name}\`\t-\t${cmd.desc}`);
        } catch (err) {
            continue;
        }
    }

    message.author.send(res);
}