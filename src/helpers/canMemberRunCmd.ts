import { GuildMember } from "discord.js";
import { Command } from "../entities/Command";
import { Errors } from "../utils/enums/Errors";
import { CookieException } from "../utils/CookieException";
import { HybridCommand } from "../utils/types/HybridCommand";

export const canMemberRunCmd = (member: GuildMember, cmd: Command) => {
    if (cmd.scope == undefined || cmd.scope == null || cmd.scope.length == 0)
        throw new CookieException(Errors.MISSING_SCOPE);

    for (let role of cmd.scope) {
        if (!member.roles.cache.has(role))
            throw new CookieException(Errors.MISSING_PERMS);
    }

    return true;
}

export const canMemberRunCmdV2 = (member: GuildMember, cmd: HybridCommand) => {
    if (cmd.scope == null || cmd.scope.length == 0)
        return true;

    for (let role of cmd.scope) {
        if (!member.roles.cache.has(role))
            return false;
    }

    return true;
}

export const canMemberRunJob = (member: GuildMember, cmd: Command) => canMemberRunCmd(member, cmd);