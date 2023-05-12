import { Message } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { getInventoryLinkForUserId } from "../helpers/getInventoryLinkForUserId";

const inventoryFn = (message: Message) => {
    const url = getInventoryLinkForUserId(message.author.id)
    message.reply(`🎒 Inventory: ${url}`);
}

export const inventory = new Command({
    name: "inventory",
    desc: "[BETA] Get link to inventory.",
    scope: [Scope.ALL],
    fn: inventoryFn
});