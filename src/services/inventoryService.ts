import { GuildMember } from "discord.js";
import { assetsRepo, inventoryRepo, profileRepo } from "../common/repos";
import { getDefaultProfileForId } from "../common/schemas/UserProfile";
import { getDefaultInventoryForId } from "../common/schemas/UserInventory";
import { validateAndPatchInventory } from "../utils/validateAndPatchInventory";
import { log } from "../common/logger";
import { sendToLogChannel } from "../utils/sendToLogChannel";

export const initializeMemberCollections = async (member: GuildMember) => {
    !(await profileRepo.get(member.id)) && await profileRepo.set(member.id, getDefaultProfileForId(member.id));
    !(await inventoryRepo.get(member.id)) && await inventoryRepo.set(member.id, getDefaultInventoryForId(member.id));
}

export const getUserInventoryForPanel = async (id: string) => {
    let userInventory = await inventoryRepo.get(id);
    userInventory = await validateAndPatchInventory(id, userInventory);

    const inventory = {
        backgrounds: []
    };

    for (const background of userInventory.backgrounds) {
        const backgroundAsset = await assetsRepo.get(background);
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