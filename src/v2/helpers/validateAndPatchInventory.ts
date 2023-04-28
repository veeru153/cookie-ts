import { CookieException } from "../utils/CookieException";
import { log } from "../utils/logger";
import { inventoryRepo, profileRepo } from "../utils/repos";
import { DEFAULT_INVENTORY, UserInventory, getDefaultInventoryForId } from "../utils/schemas/UserInventory";
import { DEFAULT_PROFILE, UserProfile, getDefaultProfileForId } from "../utils/schemas/UserProfile";
import { sendToLogChannel } from "./sendToLogChannel";

export const validateAndPatchInventory = async (id: string, inventory: UserInventory) => {
    if (!inventory) {
        inventory = getDefaultInventoryForId(id);
        return (await inventoryRepo.set(id, inventory) as UserInventory);
    }

    let needsPatch = false;

    if (inventory.id && id !== inventory.id) {
        log.error(sendToLogChannel(`[Inventory Validation] Error Patching Inventory for User Id : ${id} - Inventory Id : ${inventory.id} Mismatch`));
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
    if (inventory.coins === null || inventory.coins === undefined) {
        inventory.coins = DEFAULT_INVENTORY.coins;
        needsPatch = true;
    }
    if (inventory.cookies === null || inventory.cookies === undefined) {
        inventory.cookies = DEFAULT_INVENTORY.cookies;
        needsPatch = true;
    }
    if (inventory.lastBaked === null || inventory.cookies === undefined) {
        inventory.lastBaked = DEFAULT_INVENTORY.lastBaked;
        needsPatch = true;
    }

    if (!needsPatch)
        return inventory;

    try {
        log.info(`[Inventory Validation] Patching Inventory for User Id: ${id}`);
        return (await inventoryRepo.set(id, inventory) as UserInventory);
    } catch (err) {
        log.error(sendToLogChannel(`[Inventory Validation] Error Patching Inventory for User Id : ${id}\n${err}`));
        throw new CookieException("User Inventory is not in a valid state.");
    }
}