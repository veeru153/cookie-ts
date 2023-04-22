import { Message } from "discord.js";
import { Command } from "../entities/Command";
import { ShopError } from "../utils/enums/Errors";
import Scope from "../utils/enums/Scope";
import logger from "../utils/logger";
import { buyShopItem, getFormattedCatalogue } from "../services/shopService";

const shopFn = async (message: Message, args: string[]) => {
    try {
        switch (args[0]) {
            case "list":
                await getList(message);
                return;

            case "buy":
                await buyItem(message, args);
                return;

            default:
                await message.reply("Invalid Arguments!");
                break;
        }
    } catch (err) {
        if (Object.keys(ShopError).includes(err)) {
            message.reply(err.message);
            logger.info(`[ShopService] ${err}`);
        } else {
            message.reply("An error occurred");
            logger.error(`[ShopService] ${err}`);
        }
    }
}

const getList = async (message: Message) => {
    const list = getFormattedCatalogue();
    await message.member.send(list);
    message.deletable && await message.delete();
}

const buyItem = async (message: Message, args: string[]) => {
    if (args.length < 2)
        message.reply("Insuffcient Arguments! Missing `ITEM_ID`");
    const itemId = args[1];
    const { name, cost } = await buyShopItem(message.member, itemId);
    await message.reply(`You just bought ${name} for ${cost} 🪙`);
}


export const shop = new Command({
    name: "shop",
    desc: "[BETA] Spend Coins Here",
    scope: [Scope.ALL],
    fn: shopFn
})