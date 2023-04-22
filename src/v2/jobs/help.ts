import { Message } from "discord.js";
import { Command } from "../entities/Command";
import { PREFIX } from "../utils/constants";
import Scope from "../utils/enums/Scope";
import { canMemberRunJob } from "../helpers/canMemberRunCmd";
import * as jobs from "./index";

const helpFn = async (message: Message) => {
    const jobList = Object.values(jobs);
    let res = "__**Jobs:**__"
    for (let job of jobList) {
        try {
            const userCanRunCmd = canMemberRunJob(message.member, job);
            userCanRunCmd && (res += `\n\`${PREFIX}${job.name}\`\t-\t${job.desc}`);
        } catch (err) {
            continue;
        }
    }
    message.author.send(res);
}

export const help = new Command({
    name: "help",
    desc: "Returns info on every job.",
    scope: [Scope.STAFF],
    fn: helpFn
})