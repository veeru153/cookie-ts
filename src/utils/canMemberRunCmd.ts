import { GuildMember } from "discord.js";
import { HybridCommand } from "../common/types/HybridCommand";

export const canMemberRunCmd = (member: GuildMember, cmd: HybridCommand) => {
    if (cmd.scope == null || cmd.scope.length == 0)
        return true;

    for (let role of cmd.scope) {
        if (!member.roles.cache.has(role))
            return false;
    }

    return true;
}