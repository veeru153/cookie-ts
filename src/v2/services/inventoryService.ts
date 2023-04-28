import { GuildMember } from "discord.js";
import { assetsRepo, inventoryRepo, profileRepo } from "../utils/repos";
import { DEFAULT_PROFILE } from "../utils/schemas/UserProfile";
import { DEFAULT_INVENTORY, UserInventory } from "../utils/schemas/UserInventory";
import { validateAndPatchInventory } from "../helpers/validateAndPatchInventory";
import { log } from "../utils/logger";
import { Asset } from "../utils/schemas/Asset";
import { sendToLogChannel } from "../helpers/sendToLogChannel";

export const initializeMemberCollections = async (member: GuildMember) => {
    !profileRepo.get(member.id) && await profileRepo.set(member.id, DEFAULT_PROFILE);
    !inventoryRepo.get(member.id) && await inventoryRepo.set(member.id, DEFAULT_INVENTORY);
}

export const getUserInventoryForPanel = async (id: string) => {
    let userInventory = inventoryRepo.get(id) as UserInventory;
    userInventory = await validateAndPatchInventory(id, userInventory);

    const inventory = {
        backgrounds: []
    };

    for (const background of userInventory.backgrounds) {
        const backgroundAsset = assetsRepo.get(background) as Asset;
        if (!backgroundAsset) {
            log.warn(sendToLogChannel(`[InventoryService] Asset for background : ${background} not found`));
            continue;
        }
        inventory.backgrounds.push({
            id: background,
            name: backgroundAsset.name,
            src: backgroundAsset.src,
            ts: backgroundAsset.ts
        })
    }
    inventory.backgrounds.sort((a, b) => b.ts - a.ts)
    return inventory;
}