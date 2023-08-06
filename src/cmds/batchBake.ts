import { Message } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { getArgsMap } from "../helpers/getArgsMap";
import { CookieException } from "../utils/CookieException";
import { getUserLogString } from "../helpers/getUserLogString";
import { log } from "../utils/logger";
import { batchBakeCookies } from "../services/bakeService";
import { BATCH_BAKE_COUNT_MIN, BATCH_BAKE_COUNT_MAX } from "../utils/constants/bake";

const batchBakeFn = async (message: Message, args: string[]) => {
    try {
        const argsKeys = ["userId", "count"];
        const argsMap = getArgsMap(args, argsKeys);

        const userId = argsMap.get("userId");
        const member = message.guild.members.resolve(userId);
        if (!member) {
            throw new CookieException(`Member with user id: ${userId} not found.`);
        }

        const count = parseInt(argsMap.get("count"));
        if (count < BATCH_BAKE_COUNT_MIN || count > BATCH_BAKE_COUNT_MAX) {
            throw new CookieException(`Invalid Count: ${count}. Count must be in range 1-10.`);
        }

        const ack = await message.channel.send(`Baking ${count} batches for ${member.toString()}...`);
        const response = await batchBakeCookies(member, count);
        await message.reply(response);
        ack.deletable && ack.delete();
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