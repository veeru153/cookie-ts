import { DMChannel, Message } from "discord.js";
import Scope from "../utils/enums/Scope";
import { canMemberRunCmd } from "../helpers/canMemberRunCmd";

export class Command {
    name: string;
    desc: string;
    scope: Scope[];
    fn: Function;

    constructor({ name, desc, scope, fn }: CommandMeta) {
        this.name = name;
        this.desc = desc;
        this.scope = scope;
        this.fn = fn ?? (() => { });
    }

    run = async (message: Message, args: string[]) => {
        try {
            if (message.channel instanceof DMChannel) return;
            canMemberRunCmd(message.member, this);
            await this.fn(message, args);
        } catch (err) {
            throw err;
        }
    }

}

interface CommandMeta {
    name: string;
    desc: string;
    scope: Scope[];
    fn: Function;
}