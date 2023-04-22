import { Message } from "discord.js"
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { inventoryRepo } from "../utils/repos";
import { UserInventory } from "../utils/schemas/UserInventory";

const cookiesFn = async (message: Message) => {
    const userInv = inventoryRepo.get(message.author.id) as UserInventory;
    const res = `Total Cookies: ${userInv.cookies} 🍪`;
    await message.reply(res);
}

export const cookies = new Command({
    name: "cookies",
    desc: "[BETA] Cookie Count",
    scope: [Scope.ALL],
    fn: cookiesFn
})