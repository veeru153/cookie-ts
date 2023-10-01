import { User } from "discord.js";
import { log } from "../common/logger";
import { getDefaultHalloweenInventoryForId } from "../common/schemas/HalloweenInventory";
import { getUserLogString } from "./getUserLogString";
import { halloweenRepo } from "../common/repos";

export const getUserHalloweenInventory = async (user: User) => {
    const inventory = await halloweenRepo.get(user.id);
    if (inventory != null) {
        return inventory;
    }

    log.info(`[Halloween 2023] ${getUserLogString(user)} does not have Halloween inventory. Providing and setting default.`);
    return getDefaultHalloweenInventoryForId(user.id);
}