import { Client, Message, GuildMember } from "discord.js/typings";
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

    run = async (client: Client, message: Message, args: string[]) => {}

    _canUserInvokeCmd = (member: GuildMember) => {
        if (this.scope == undefined || this.scope == null || this.scope.length == 0) return true;
        for (let role in this.scope) {
            if (!member.roles.cache.has(role)) return false;
        }

        return true;
    }

    _invoke = async (client: Client, message: Message, args: string[]) => {
        if(this._canUserInvokeCmd(message.member)) {
            await this.run(client, message, args);
        }
    }
}

export default Command;