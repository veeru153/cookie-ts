import { Client, Message, GuildMember } from "discord.js";
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
        if (this.scope == undefined || this.scope == null || this.scope.length == 0)
            throw new Error("Scope is null or empty.")

        for (let role of this.scope) {
            if (!member.roles.cache.has(role)) {
                throw new Error("Insufficient Permissions.");
            }
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