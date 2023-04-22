import { GuildMember } from "discord.js";
import { Command } from "../entities/Command";
import { Errors } from "../utils/enums/Errors";

export const canMemberRunCmd = (member: GuildMember, cmd: Command) => {
    if (cmd.scope == undefined || cmd.scope == null || cmd.scope.length == 0)
        throw new Error(Errors.MISSING_SCOPE);

    for (let role of cmd.scope) {
        if (!member.roles.cache.has(role))
            throw new Error(Errors.MISSING_PERMS);
    }

    return true;
}