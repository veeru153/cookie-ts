import { Message, GuildMember } from "discord.js";
import { Errors } from "../util/constants";
import Scope from "../util/scope";

interface CommandMeta {
    name: string,
    desc: string,
    scope: Scope[];
}

class Command {
    name: string;
    desc: string;
    scope: Scope[];

    constructor({ name, desc, scope }: CommandMeta) {
        this.name = name;
        this.desc = desc;
        this.scope = scope;
    }

    run = async (message: Message, args: string[]) => {}

    _canUserInvokeCmd = (member: GuildMember) => {
        if (this.scope == undefined || this.scope == null || this.scope.length == 0)
            throw new Error(Errors.MISSING_SCOPE);

        for (let role of this.scope) {
            if (!member.roles.cache.has(role)) 
                throw new Error(Errors.MISSING_PERMS);
        }

        return true;
    }

    _invoke = async (message: Message, args: string[]) => {
        try {
            this._canUserInvokeCmd(message.member);
            await this.run(message, args);
        } catch (err) {
            throw err;   
        }
    }
}

export default Command;