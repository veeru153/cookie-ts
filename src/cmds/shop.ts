import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { SHOP_URL } from "../common/constants/common";
import { isArrayUnavailable, isStringBlank } from "../utils/validators";
import { HybridCommand } from "../common/types/HybridCommand";
import { buyShopItem } from "../services/shopService";
import { log } from "../common/logger";
import { sendToLogChannel } from "../utils/sendToLogChannel";
import { CookieException } from "../common/CookieException";

enum ShopAction {
    LINK = "link",
    BUY = "buy"
}

const shopFn = async (member: GuildMember, action?: ShopAction, itemId?: string) => {
    if (action == null || action === ShopAction.LINK) {
        return `🛒 Shop: ${SHOP_URL}`;
    }

    if (action === ShopAction.BUY) {
        if (member == null) {
            log.error(sendToLogChannel("[Shop] Could not find member"));
            return "An error occurred!";
        }

        if (isStringBlank(itemId)) {
            return "Please enter a valid `item_id`";
        }

        const { name, cost } = await buyShopItem(member, itemId);
        return `You just bought ${name} for ${cost} 🍪`;
    }

    return "Please enter a valid action: `link | buy`";
}

const legacy = async (message: Message, args: string[]) => {
    let res: string = null;
    if (isArrayUnavailable(args) || args.length === 0) {
        res = await shopFn(message.member, ShopAction.LINK);
    } else if (args.length === 1) {
        if (args[0] === ShopAction.LINK) {
            res = await shopFn(message.member, ShopAction.LINK);
        } else if (args[0] === ShopAction.BUY) {
            res = "Please enter an `item_id`";
        } else {
            res = "Please enter a valid action: `link | buy`";
        }
    } else if (args.length === 2) {
        if (args[0] === ShopAction.BUY) {
            const itemId = args[1];
            res = await shopFn(message.member, ShopAction.BUY, itemId);
        } else if (args[0] === ShopAction.LINK) {
            res = await shopFn(message.member, ShopAction.LINK);
        } else {
            res = "Please enter a valid action: `link | buy`";
        }
    } else {
        throw new CookieException("Invalid arguments")
    }

    await message.reply(res);
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    let res: string = null;
    const action = interaction.options.getSubcommand();
    const member = (interaction.member as GuildMember);

    if (action === ShopAction.LINK) {
        res = await shopFn(member, ShopAction.LINK);
    } else if (action === ShopAction.BUY) {
        const itemId = interaction.options.getString("item_id");
        if (isStringBlank(itemId)) {
            res = "Please enter a valid `item_id`";
        } else {
            res = await shopFn(member, ShopAction.BUY, itemId);
        }
    } else {
        res = "Please enter a valid action: `link | buy`";
    }

    interaction.reply(res);
}

export const shop: HybridCommand = {
    info: {
        name: "shop",
        description: "A place to spend cookies to upgrade your profile",
        options: [
            {
                name: "link",
                description: "Get link to the shop",
                required: false,
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "buy",
                description: "Buy an item with the item_id",
                required: false,
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "item_id",
                        description: "The ID of the item in the shop",
                        required: true,
                        type: ApplicationCommandOptionType.String
                    }
                ]
            },
        ]
    },
    legacy: async (message: Message, args: any[]) => await legacy(message, args),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
}