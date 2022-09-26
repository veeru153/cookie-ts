import { Message } from "discord.js";
import logger from "../util/logger";
import collections from "../util/collections";
import Scope from "../util/scope";
import Command from "./_Command";
import { getUserLogString } from "../helpers";
import isDevEnv from "../util/isDevEnv";
import { ranksRepo, inventoryRepo } from "../util/collections_v2";

export const bake = new Command({
    name: "bake",
    desc: "Bake Cookies 🍪",
    scope: [Scope.ALL]
})

const HALF_DAY_IN_MS = 43200000;
const HOUR_IN_MS = 3600000;
const MINUTE_IN_MS = 60000;
const SECOND_IN_MS = 1000;
const MULTIPLIER = 1.5;
const GUARANTEE = 1;

bake.run = async (message: Message, args: string[]) => {
    try {
        const userId = message.author.id;
        const userRank = ranksRepo.get(userId);
        const userInventory = inventoryRepo.get(userId);
        const currTime = Date.now();

        if (userInventory == null) {
            const freshCookies = Math.floor((Math.random() + GUARANTEE) * MULTIPLIER);
            inventoryRepo.set(userId, {
                cookies: freshCookies,
                lastBaked: currTime,
            })

            await sendBakeSuccessMsg(message, freshCookies, freshCookies);
            return;
        }

        const { cookies, lastBaked } = userInventory;
        const timeDiff = currTime - lastBaked;

        if (timeDiff < HALF_DAY_IN_MS) {
            await sendCooldownMsg(message, timeDiff, cookies);
            return;
        }

        const userLevel = userRank.level;
        const skew = Math.floor(Math.random() * (0.13 - 0.03 + 1) + 0.03);
        const bias = Math.max(0, Math.random() - skew);
        const freshCookies = Math.floor(((bias * userLevel) + GUARANTEE) * MULTIPLIER);

        inventoryRepo.set(userId, {
            cookies: cookies + freshCookies,
            lastBaked: currTime,
        })

        await sendBakeSuccessMsg(message, freshCookies, cookies + freshCookies);
    } catch (err) {
        const replyMsg = await message.reply("An error occured!");
        setTimeout(() => {
            replyMsg.deletable && replyMsg.delete();
            message.deletable && message.delete();
        }, 5000);
        logger.error(`[Bake] ${err}`);
    }
}

const sendBakeSuccessMsg = async (message: Message, freshCookies: number, cookies: number) => {
    logger.info(`[Bake] ${getUserLogString(message.author)} baked ${freshCookies} cookies. Total Cookies : ${cookies}`);

    const cookieStr = freshCookies == 1 ? "cookie" : "cookies";
    const msg = `**Cookies Baked!**\nYou baked ${freshCookies} ${cookieStr}.\n**🍪 Total Cookies: ${cookies}**`;
    message.reply(msg);
}

const sendCooldownMsg = async (message: Message, timeDiff: number, cookies: number) => {
    logger.info(`[Bake] User : ${getUserLogString(message.author)} is on cooldown`);

    const remainingMs = HALF_DAY_IN_MS - timeDiff;

    if (remainingMs < MINUTE_IN_MS) {
        const seconds = Math.floor((remainingMs / SECOND_IN_MS) % 60).toString().padStart(2, "0");
        const msg = `**Oven needs to cool down!**\nYou can bake more cookies in ${seconds} seconds.\n**🍪 Total Cookies: ${cookies}**`;
        message.reply(msg);
        return;
    }

    const hours = Math.floor(remainingMs / HOUR_IN_MS).toString().padStart(2, "0");
    const minutes = Math.floor((remainingMs % HOUR_IN_MS) / MINUTE_IN_MS).toString().padStart(2, "0");
    const msg = `**Oven needs to cool down!**\nYou can bake more 🍪 in ${hours} hours ${minutes} minutes.\n**🍪 Total Cookies: ${cookies}**`;
    message.reply(msg);
}