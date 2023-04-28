import { GuildMember } from "discord.js";
import { inventoryRepo, profileRepo } from "../utils/repos";
import { DEFAULT_PROFILE, UserProfile, getDefaultProfileForId } from "../utils/schemas/UserProfile";
import { CookieException } from "../utils/CookieException";
import { log } from "../utils/logger";
import { DEFAULT_INVENTORY, UserInventory, getDefaultInventoryForId } from "../utils/schemas/UserInventory";
import { sendToLogChannel } from "../helpers/sendToLogChannel";
export const initializeMemberCollections = async (member: GuildMember) => {
    !profileRepo.get(member.id) && await profileRepo.set(member.id, DEFAULT_PROFILE);
    !inventoryRepo.get(member.id) && await inventoryRepo.set(member.id, DEFAULT_INVENTORY);
}

export const validateAndPatchProfile = async (id: string, profile: UserProfile) => {
    // TODO: Remove profile.bg and DEFAULT entirely after v1 deprecation

    if (!profile) {
        profile = getDefaultProfileForId(id);
        return (await profileRepo.set(id, profile) as UserProfile);
    }

    let needsPatch = false;

    if (profile.id && id !== profile.id) {
        log.error(sendToLogChannel(`[Inventory Service] Error Patching Profile for User Id : ${id} - Profile Id : ${profile.id} Mismatch`));
        throw new CookieException("User Profile is not in a valid state.");
    }

    if (!profile.bg || profile.bg === "DEFAULT") {
        profile.bg = DEFAULT_PROFILE.background;
        needsPatch = true;
    }
    if (!profile.background) {
        profile.background = profile.bg;
        needsPatch = true;
    }
    if (!profile.badge1) {
        profile.badge1 = DEFAULT_PROFILE.badge1;
        needsPatch = true;
    }
    if (!profile.badge2) {
        profile.badge2 = DEFAULT_PROFILE.badge2;
        needsPatch = true;
    }
    if (!profile.level) {
        profile.level = DEFAULT_PROFILE.level;
        needsPatch = true;
    }
    if (!profile.xp) {
        profile.xp = DEFAULT_PROFILE.xp;
        needsPatch = true;
    }

    if (!needsPatch)
        return profile;

    try {
        log.info(`[Inventory Service] Patching profile for User Id: ${id}`);
        return (await profileRepo.set(id, profile) as UserProfile);
    } catch (err) {
        log.error(sendToLogChannel(`[Inventory Service] Error Patching Profile for User Id : ${id}\n${err}`));
        throw new CookieException("User Profile is not in a valid state.");
    }
}

export const validateAndPatchInventory = async (id: string, inventory: UserInventory) => {
    if (!inventory) {
        inventory = getDefaultInventoryForId(id);
        return (await inventoryRepo.set(id, inventory) as UserInventory);
    }

    let needsPatch = false;

    if (inventory.id && id !== inventory.id) {
        log.error(sendToLogChannel(`[Inventory Service] Error Patching Inventory for User Id : ${id} - Inventory Id : ${inventory.id} Mismatch`));
        throw new CookieException("User Inventory is not in a valid state.");
    }

    if (!inventory.backgrounds || inventory.backgrounds.length === 0) {
        inventory.backgrounds = DEFAULT_INVENTORY.backgrounds;
        needsPatch = true;
    }

    if (!inventory.badges || inventory.badges.length === 0) {
        inventory.badges = DEFAULT_INVENTORY.badges;
        needsPatch = true;
    }

    if (!inventory.coins) {
        inventory.coins = DEFAULT_INVENTORY.coins;
        needsPatch = true;
    }

    if (!inventory.cookies) {
        inventory.cookies = DEFAULT_INVENTORY.cookies;
        needsPatch = true;
    }
    if (!inventory.lastBaked) {
        inventory.lastBaked = DEFAULT_INVENTORY.lastBaked;
        needsPatch = true;
    }

    if (!needsPatch)
        return;

    try {
        log.info(`[Inventory Service] Patching Inventory for User Id: ${id}`);
        return (await inventoryRepo.set(id, inventory) as UserInventory);
    } catch (err) {
        log.error(sendToLogChannel(`[Inventory Service] Error Patching Inventory for User Id : ${id}\n${err}`));
        throw new CookieException("User Inventory is not in a valid state.");
    }
}