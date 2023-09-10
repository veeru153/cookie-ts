import { Message } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { bakeCookies } from "../services/bakeService";
import { getUserLogString } from "../helpers/getUserLogString";
import { log } from "../utils/logger";

const bakeFn = async (message: Message) => {
    try {
        const response = await bakeCookies(message.member);
        await message.reply(response);
    } catch (err) {
        log.error(`[Bake] User : ${getUserLogString(message.author)}\nError : ${err}`);
        const replyMsg = await message.reply("An error occurred!");
        setTimeout(() => {
            replyMsg.deletable && replyMsg.delete();
            message.deletable && message.delete();
        }, 5000);
    }
}


export const bake = new Command({
    name: "bake",
    desc: "Bake Cookies 🍪",
    scope: [Scope.ALL],
    fn: bakeFn
})