import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { isArrayUnavailable, isStringBlank } from "../utils/validators";
import { HybridCommand } from "../common/types/HybridCommand";
import { log } from "../common/logger";
import { sendToLogChannel } from "../utils/sendToLogChannel";
import { CookieException } from "../common/CookieException";
import { halloweenRepo, inventoryRepo } from "../common/repos";
import { validateAndPatchInventory } from "../utils/validateAndPatchInventory";
import { getUserHalloweenInventory } from "../utils/getUserHalloweenInventory";
import { isDevEnv } from "../common/constants/common";

enum CoinsAction {
    GET = "get",
    CONVERT = "convert"
}

const COIN_TO_COOKIE_RATIO = 0.5;
const COIN_TO_COOKIE_MIN = 2;

// TODO: Maintain start and end dates at a central place. Only halloween now so we keep them here
const START_DATE = new Date("2023-10-01T00:00:00.000+09:00");
const END_DATE = new Date("2023-10-31T23:59:59.000+09:00");

const coinsFn = async (member: GuildMember, action?: CoinsAction, count?: number) => {
    if (member == null) {
        log.error(sendToLogChannel("[Shop] Could not find member"));
        return "An error occurred!";
    }

    const currDate = Date.now();
    if (!isDevEnv && (currDate < START_DATE.getTime() || currDate > END_DATE.getTime())) {
        return "Coins are only accessible during certain events";
    }

    const userHalloweenInventory = await getUserHalloweenInventory(member.user);
    const coins = userHalloweenInventory.coins;

    if (action == null || action === CoinsAction.GET) {
        return `🪙 Total Coins: ${coins}`;
    }

    if (action === CoinsAction.CONVERT) {
        if (count == null || count < COIN_TO_COOKIE_MIN) {
            return "Please enter a valid `count`";
        }

        let userInventory = await inventoryRepo.get(member.id);
        userInventory = await validateAndPatchInventory(member.id, userInventory);

        if (count > userHalloweenInventory.coins) {
            return "You don't have enough coins";
        }

        const cookies = Math.floor(count * COIN_TO_COOKIE_RATIO);
        const remainingCoins = Math.floor(count % (1 / COIN_TO_COOKIE_RATIO));

        userInventory.cookies += cookies;
        userHalloweenInventory.coins = coins - count + remainingCoins;

        !isDevEnv && inventoryRepo.set(member.id, userInventory);
        halloweenRepo.set(member.id, userHalloweenInventory);

        return `You converted ${count - remainingCoins} 🪙 for ${cookies} 🍪`;
    }

    return "Please enter a valid action: `get | convert`";
}

const legacy = async (message: Message, args: string[]) => {
    let res: string = null;
    if (isArrayUnavailable(args) || args.length === 0) {
        res = await coinsFn(message.member, CoinsAction.GET);
    } else if (args.length === 1) {
        if (args[0] === CoinsAction.GET) {
            res = await coinsFn(message.member, CoinsAction.GET);
        } else if (args[0] === CoinsAction.CONVERT) {
            res = "Please enter an `count`";
        } else {
            res = "Please enter a valid action: `get | convert`";
        }
    } else if (args.length === 2) {
        if (args[0] === CoinsAction.CONVERT) {
            const count = parseInt(args[1]);
            if (isNaN(count)) {
                res = "Please enter an `count`";
            } else {
                res = await coinsFn(message.member, CoinsAction.CONVERT, count);
            }
        } else if (args[0] === CoinsAction.GET) {
            res = await coinsFn(message.member, CoinsAction.GET);
        } else {
            res = "Please enter a valid action: `get | convert`";
        }
    } else {
        throw new CookieException("Invalid arguments");
    }

    await message.reply(res);
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    let res: string = null;
    const action = interaction.options.getSubcommand();
    const member = (interaction.member as GuildMember);

    if (action === CoinsAction.GET) {
        res = await coinsFn(member, CoinsAction.GET);
    } else if (action === CoinsAction.CONVERT) {
        const count = interaction.options.getNumber("count");
        if (isNaN(count)) {
            res = "Please enter a valid `count`";
        } else {
            res = await coinsFn(member, CoinsAction.CONVERT, count);
        }
    } else {
        res = "Please enter a valid action: `get | convert`";
    }

    interaction.reply(res);
}

export const coins: HybridCommand = {
    info: {
        name: "coins",
        description: "(Events Only) Get current number of coins or convert coins to cookies",
        options: [
            {
                name: "get",
                description: "Get number of coins",
                required: false,
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "convert",
                description: "Convert coins to cookies",
                required: false,
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "count",
                        description: "Number of coins to convert",
                        required: true,
                        type: ApplicationCommandOptionType.Number,
                        min_value: COIN_TO_COOKIE_MIN
                    }
                ]
            },
        ]
    },
    legacy: async (message: Message, args: any[]) => await legacy(message, args),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
}