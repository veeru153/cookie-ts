import { GuildMember, User } from "discord.js";
import { isDevEnv } from "../utils/constants";
import { inventoryRepo } from "../utils/repos";
import { validateAndPatchInventory } from "../helpers/validateAndPatchInventory";
import { getUserLogString } from "../helpers/getUserLogString";
import { log } from "../utils/logger";
import { getBakeTierFromPity, getUpdatedBakePity } from "./bakePityService";
import { getRandomNumberBetween } from "../helpers/getRandomNumberBetween";
import { CookieException } from "../utils/CookieException";

const COOLDOWN_HR = isDevEnv ? 0.00111111 : 4;
const COOLDOWN_MS = COOLDOWN_HR * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;
const MINUTE_IN_MS = 60 * 1000;
const SECOND_IN_MS = 1000;

const BOOSTER_MULTIPLIER = 0.1;
const PROMOTIONAL_MULTIPLIER = 0;
const EVENT_MULTIPLIER = 0;

const COOKIE_TIER_RANGE = {
    T0_MIN: 1,
    T0_MAX: 3,
    T1_MIN: 7,
    T1_MAX: 11,
    T2_MIN: 14,
    T2_MAX: 18,
    T3_MIN: 21,
    T3_MAX: 25,
}

export const bakeCookies = async (member: GuildMember) => {
    const { user } = member;
    const { id } = user;
    let userInventory = await inventoryRepo.get(id);
    userInventory = await validateAndPatchInventory(id, userInventory);
    const currTime = Date.now();

    const { cookies, lastBaked } = userInventory;
    const timeDiff = currTime - lastBaked;

    if (timeDiff < COOLDOWN_MS) {
        return getCooldownMsg(user, timeDiff, cookies);
    }

    const bakePity = userInventory.bakePity;
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

    return getBakeSuccessMsg(user, freshCookies, cookies);
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