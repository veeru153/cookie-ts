import { Message } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { getArgsMap } from "../helpers/getArgsMap";
import { CookieException } from "../utils/CookieException";
import { getUserLogString } from "../helpers/getUserLogString";
import { log } from "../utils/logger";
import { batchBakeCookies } from "../services/bakeService";

const batchBakeFn = async (message: Message, args: string[]) => {
    try {
        const argsKeys = ["userId", "count"];
        const argsMap = getArgsMap(args, argsKeys);

        const userId = argsMap.get("userId");
        const member = message.guild.members.cache.get(userId);
        if (!member) {
            throw new CookieException(`Member with user id: ${userId} not found.`);
        }

        const count = parseInt(argsMap.get("count"));
        const response = await batchBakeCookies(member, count);
        await message.reply(response);
    } catch (err) {
        log.error(`[Bake] User : ${getUserLogString(message.author)}\nError : ${err}`);
        if (err instanceof CookieException) {
            await message.reply(err.message);
        } else {
            const replyMsg = await message.reply("An error occurred!");
            setTimeout(() => {
                replyMsg.deletable && replyMsg.delete();
                message.deletable && message.delete();
            }, 5000);
        }
    }
}

export const batchBake = new Command({
    name: "batchBake",
    desc: "Bakes missed batches (due to Cookie outage)",
    scope: [Scope.ADMIN],
    fn: batchBakeFn
})