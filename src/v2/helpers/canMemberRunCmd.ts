import { GuildMember } from "discord.js";
import { Command } from "../entities/Command";
import { Errors } from "../utils/enums/Errors";
import { CookieException } from "../utils/CookieException";

export const canMemberRunCmd = (member: GuildMember, cmd: Command) => {
    if (cmd.scope == undefined || cmd.scope == null || cmd.scope.length == 0)
        throw new CookieException(Errors.MISSING_SCOPE);

    for (let role of cmd.scope) {
        if (!member.roles.cache.has(role))
            throw new CookieException(Errors.MISSING_PERMS);
    }

    return true;
}

export const canMemberRunJob = (member: GuildMember, cmd: Command) => canMemberRunCmd(member, cmd);