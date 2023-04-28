import { Message } from "discord.js"
import { Command } from "../entities/Command"
import Scope from "../utils/enums/Scope"
import { inventoryRepo, profileRepo } from "../utils/repos"
import { UserInventory } from "../utils/schemas/UserInventory"
import { UserProfile } from "../utils/schemas/UserProfile"
import { validateAndPatchInventory } from "../helpers/validateAndPatchInventory";
import { validateAndPatchProfile } from "../helpers/validateAndPatchProfile"

const tempPatchInventoryFn = async (message: Message) => {
    const profileData = profileRepo.data;
    for (const _profile of profileData) {
        const id = _profile[0];
        const profile = (_profile[1] as UserProfile);
        await validateAndPatchProfile(id, profile);
    }

    const inventoryData = inventoryRepo.data;
    for (const _inventory of inventoryData) {
        const id = _inventory[0];
        const inventory = (_inventory[1] as UserInventory);
        await validateAndPatchInventory(id, inventory);
    }
}

export const tempPatchInventory = new Command({
    name: "tempPatchInventory",
    desc: "Temp",
    scope: [Scope.ADMIN],
    fn: tempPatchInventoryFn
})