import { Message } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { buyShopItem } from "../services/shopService";
import { CookieException } from "../utils/CookieException";
import { log } from "../utils/logger";
import { sendToLogChannel } from "../helpers/sendToLogChannel";
import { SHOP_URL } from "../utils/constants/common";

const shopFn = async (message: Message, args: string[]) => {
    if (args.length === 0) {
        await message.reply(`🛒 Shop: ${SHOP_URL}`);
        return;
    }

    try {
        switch (args[0]) {
            case "buy":
                await buyItem(message, args);
                return;

            default:
                await message.reply("Invalid Arguments!");
                break;
        }
    } catch (err) {
        if (err instanceof CookieException) {
            message.reply(err.message);
        } else {
            message.reply("An error occurred");
            log.error(sendToLogChannel(`[ShopService] Error : ${err}`))
        }
    }
}

const buyItem = async (message: Message, args: string[]) => {
    if (args.length < 2) {
        message.reply("Insuffcient Arguments! Missing `ITEM_ID`");
        return;
    }
    const itemId = args[1];
    const { name, cost } = await buyShopItem(message.member, itemId);
    await message.reply(`You just bought ${name} for ${cost} 🍪`);
}


export const shop = new Command({
    name: "shop",
    desc: "[BETA] A place to spend cookies to upgrade your profile.",
    scope: [Scope.ALL],
    fn: shopFn
})