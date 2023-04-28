import { Message } from "discord.js"
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { inventoryRepo } from "../utils/repos";
import { UserInventory } from "../utils/schemas/UserInventory";
import { validateAndPatchInventory } from "../services/inventoryService";

const cookiesFn = async (message: Message) => {
    let userInv = inventoryRepo.get(message.author.id) as UserInventory;
    userInv = await validateAndPatchInventory(message.author.id, userInv);
    const res = `🍪 Total Cookies: ${userInv.cookies}`;
    await message.reply(res);
}

export const cookies = new Command({
    name: "cookies",
    desc: "[BETA] Returns number of cookies",
    scope: [Scope.ALL],
    fn: cookiesFn
})