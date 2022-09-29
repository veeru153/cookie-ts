import { Message } from "discord.js";
import { UserInventory } from "../util/collectionTypes";
import { eventsRepo, inventoryRepo } from "../util/collections";
import Scope from "../util/scope";
import Command from "./_Command";

export const wallet = new Command({
    name: "wallet",
    desc: "[BETA] Check balance",
    scope: [ Scope.ALL ]
})

wallet.run = async (message: Message, args: string[]) => {
    // TODO: Replace every event
    
    const { id } = message.author;
    const userInv = inventoryRepo.get(id) as UserInventory;
    const eventUserData = eventsRepo.get("HALLOWEEN_2022")[id];
    const res = `💰 Total Coins: ${userInv.coins} 🪙\n🎃 Event Coins: ${eventUserData.coins} 🪙`;
    await message.reply(res);
}