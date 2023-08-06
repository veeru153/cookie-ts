import { GuildMember, User } from "discord.js";
import { isDevEnv } from "../utils/constants/common";
import { inventoryRepo } from "../utils/repos";
import { validateAndPatchInventory } from "../helpers/validateAndPatchInventory";
import { getUserLogString } from "../helpers/getUserLogString";
import { log } from "../utils/logger";
import { getBakeTierFromPity, getUpdatedBakePity } from "./bakePityService";
import { getRandomNumberBetween } from "../helpers/getRandomNumberBetween";
import { CookieException } from "../utils/CookieException";
import { COOLDOWN_MS, PROMOTIONAL_MULTIPLIER, EVENT_MULTIPLIER, BOOSTER_MULTIPLIER, COOKIE_TIER_RANGE } from "../utils/constants/bake";
import { MINUTE_IN_MS, SECOND_IN_MS, HOUR_IN_MS } from "../utils/constants/common";


export const bakeCookies = async (member: GuildMember) => {
    const { user, id } = member;
    let userInventory = await inventoryRepo.get(id);
    userInventory = await validateAndPatchInventory(id, userInventory);
    const currTime = Date.now();

    const { cookies, lastBaked, bakePity } = userInventory;
    const timeDiff = currTime - lastBaked;

    if (timeDiff < COOLDOWN_MS) {
        return getCooldownMsg(user, timeDiff, cookies);
    }

    const bakeTier = getBakeTierFromPity(bakePity);
    const multiplier = getMultiplier(member);
    const baseFreshCookies = getFreshCookiesFromBakeTier(bakeTier);
    const freshCookies = Math.round(baseFreshCookies * multiplier);
    const updatedCookies = cookies + freshCookies;
    const updatedBakePity = getUpdatedBakePity(bakeTier, bakePity);

    if (!isDevEnv) {
        // Only update when not testing!
        userInventory.cookies = updatedCookies;
        userInventory.bakePity = updatedBakePity;
        userInventory.lastBaked = currTime;
        inventoryRepo.set(id, userInventory);
    }

    return getBakeSuccessMsg(user, freshCookies, updatedCookies);
}

export const batchBakeCookies = async (member: GuildMember, count: number) => {
    const { user, id: userId } = member;
    let userInventory = await inventoryRepo.get(userId);
    if (!userInventory) {
        throw new CookieException(`Inventory for user with id: ${userId} not found.`);
    }
    userInventory = await validateAndPatchInventory(userId, userInventory);
    const currTime = Date.now();

    const { cookies, bakePity } = userInventory;
    const multiplier = getMultiplier(member);
    let freshCookies = 0;
    let updatedBakePity = bakePity;

    const bakeList = [];

    for (let i = 0; i < count; i++) {
        const bakeTier = getBakeTierFromPity(updatedBakePity);
        const baseFreshCookies = getFreshCookiesFromBakeTier(bakeTier);
        const newCookies = Math.round(baseFreshCookies * multiplier);
        bakeList.push(newCookies);
        freshCookies += newCookies;
        updatedBakePity = getUpdatedBakePity(bakeTier, updatedBakePity);
    }

    const updatedCookies = cookies + freshCookies;

    if (!isDevEnv) {
        // Only update when not testing!
        userInventory.cookies = updatedCookies;
        userInventory.bakePity = updatedBakePity;
        userInventory.lastBaked = currTime;
        inventoryRepo.set(member.id, userInventory);
    }

    return getBatchBakeSuccessMsg(user, freshCookies, updatedCookies, bakeList);
}

const getMultiplier = (member: GuildMember) => {
    // TODO: Add userEquippedMultiplier once implemented
    let sum = PROMOTIONAL_MULTIPLIER + EVENT_MULTIPLIER;
    if (member.roles.premiumSubscriberRole) {
        sum += BOOSTER_MULTIPLIER;
    }
    return 1 + sum;
}

const getFreshCookiesFromBakeTier = (tier: number) => {
    if (tier === 0) return getRandomNumberBetween(COOKIE_TIER_RANGE.T0_MIN, COOKIE_TIER_RANGE.T0_MAX);
    if (tier === 1) return getRandomNumberBetween(COOKIE_TIER_RANGE.T1_MIN, COOKIE_TIER_RANGE.T1_MAX);
    if (tier === 2) return getRandomNumberBetween(COOKIE_TIER_RANGE.T2_MIN, COOKIE_TIER_RANGE.T2_MAX);
    if (tier === 3) return getRandomNumberBetween(COOKIE_TIER_RANGE.T3_MIN, COOKIE_TIER_RANGE.T3_MAX);

    throw new CookieException(`[Bake] Invalid Tier : ${tier}`);
}

const getBakeSuccessMsg = (user: User, freshCookies: number, cookies: number) => {
    log.info(`[Bake] ${getUserLogString(user)} baked ${freshCookies} cookies. Total Cookies : ${cookies}`);
    const cookieStr = freshCookies == 1 ? "cookie" : "cookies";
    return `**Cookies Baked!**\nYou baked ${freshCookies} ${cookieStr}.\n**🍪 Total Cookies: ${cookies}**`;
}

const getBatchBakeSuccessMsg = (user: User, freshCookies: number, cookies: number, bakeList: number[]) => {
    log.info(`[Batch Bake] ${getUserLogString(user)} baked ${freshCookies} cookies. Total Cookies : ${cookies}\nBake List: ${bakeList}`);
    const cookieStr = freshCookies == 1 ? "cookie" : "cookies";
    return `**Cookies Baked!**\n${bakeList.length} batches were baked for ${user.toString()}.\n${freshCookies} ${cookieStr} baked - (${bakeList.join(", ")})\n**🍪 Total Cookies: ${cookies}**`;
}

const getCooldownMsg = (user: User, timeDiff: number, cookies: number) => {
    log.info(`[Bake] User : ${getUserLogString(user)} is on cooldown`);
    const remainingMs = COOLDOWN_MS - timeDiff;

    if (remainingMs < MINUTE_IN_MS) {
        const seconds = Math.floor((remainingMs / SECOND_IN_MS) % 60).toString().padStart(2, "0");
        return `**Oven needs to cool down!**\nYou can bake more cookies in ${seconds} seconds.\n**🍪 Total Cookies: ${cookies}**`;
    }

    const hours = Math.floor(remainingMs / HOUR_IN_MS).toString().padStart(2, "0");
    const minutes = Math.floor((remainingMs % HOUR_IN_MS) / MINUTE_IN_MS).toString().padStart(2, "0");
    return `**Oven needs to cool down!**\nYou can bake more 🍪 in ${hours} hours ${minutes} minutes.\n**🍪 Total Cookies: ${cookies}**`;
}