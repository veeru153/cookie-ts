import { Message } from "discord.js";
import { Command } from "../entities/Command";
import { PREFIX } from "../utils/constants";
import Scope from "../utils/enums/Scope";
import { canMemberRunCmd } from "../helpers/canMemberRunCmd";
import * as cmds from "./index";

const helpFn = async (message: Message) => {
    const cmdList = Object.values(cmds);
    let res = "__**Commands:**__"
    for (let cmd of cmdList) {
        try {
            const userCanRunCmd = canMemberRunCmd(message.member, cmd);
            userCanRunCmd && (res += `\n\`${PREFIX}${cmd.name}\`\t-\t${cmd.desc}`);
        } catch (err) {
            continue;
        }
    }
    message.author.send(res);
}

export const help = new Command({
    name: "help",
    desc: "Returns info on every command.",
    scope: [Scope.ALL],
    fn: helpFn
})