import { SHOP_URL } from "../../utils/constants/common";
import { isArrayUnavailable, isStringBlank } from "../../helpers/validators";
import { HybridCommand } from "../../utils/types/HybridCommand";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { buyShopItem } from "../../services/shopService";
import { log } from "../../utils/logger";
import { sendToLogChannel } from "../../helpers/sendToLogChannel";
import { CookieException } from "../../utils/CookieException";

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
            try {
                res = await shopFn(message.member, ShopAction.BUY, itemId);
            } catch (err) {
                if (err instanceof CookieException) {
                    res = err.message;
                } else {
                    res = "An error occurred!";
                    sendToLogChannel(`[Shop] Error: ${err}`);
                    log.error(err);
                }
            }
        } else if (args[0] === ShopAction.LINK) {
            res = await shopFn(message.member, ShopAction.LINK);
        } else {
            res = "Please enter a valid action: `link | buy`";
        }
    }

    await message.reply(res);
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.inCachedGuild()) {
        log.warn(sendToLogChannel("[shop] Slash Command executed in uncached guild. Skipping."));
        return;
    }
    let res: string = null;

    const action = interaction.options.getSubcommand();
    if (action === ShopAction.LINK) {
        res = await shopFn(interaction.member, ShopAction.LINK);
    } else if (action === ShopAction.BUY) {
        const itemId = interaction.options.getString("item_id");
        if (isStringBlank(itemId)) {
            res = "Please enter a valid `item_id`";
        } else {
            try {
                res = await shopFn(interaction.member, ShopAction.BUY, itemId);
            } catch (err) {
                if (err instanceof CookieException) {
                    res = err.message;
                } else {
                    res = "An error occurred!";
                    sendToLogChannel(`[Shop] Error: ${err}`);
                    log.error(err);
                }
            }
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
                description: "Get the link to the shop",
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