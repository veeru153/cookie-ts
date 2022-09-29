import { Message } from "discord.js";
import logger from "../util/logger";
import ShopService from "../services/shopService";
import Scope from "../util/scope";
import Command from "./_Command";
import { Errors } from "../util/constants";

const HANDLED_ERRORS = [
    Errors.SHOP_ITEM_NOT_FOUND,
    Errors.SHOP_ITEM_TIME_LIMITED,
    Errors.SHOP_ITEM_UNLISTED,
    Errors.SHOP_MEMBERSHIP_TIME_TOO_LOW,
    Errors.SHOP_NOT_ENOUGH_COINS,
    Errors.SHOP_USER_LEVEL_LOW,
    Errors.SHOP_USER_HAS_ITEM,
    Errors.SHOP_ITEM_OUT_OF_STOCK,
]

export const shop = new Command({
    name: "shop",
    desc: "[BETA] Spend Coins Here",
    scope: [Scope.ALL]
})

shop.run = async (message: Message, args: string[]) => {
    try {
        switch (args[0]) {
            case "list":
                const list = await ShopService.list();
                await message.member.send(list);
                message.deletable && await message.delete();
                break;

            case "buy":
                if (args.length < 2)
                    message.reply("Insuffcient Arguments! Missing `ITEM_ID`");
                const itemId = args[1];
                const { name, cost } = await ShopService.buy(message.member, itemId);
                await message.reply(`You just bought ${name} for ${cost} 🪙`);
                break;

            default:
                await message.reply("Insuffcient Arguments!");
                break;
        }
    } catch (err) {
        console.log(err, HANDLED_ERRORS);
        if (HANDLED_ERRORS.includes(err.message)) {
            message.reply(err.message);
            logger.info(`[ShopService] ${err}`);
        } else {
            message.reply("An error occurred");
            logger.error(`[ShopService] ${err}`);
        }

    }
}