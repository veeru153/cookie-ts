import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { HybridCommand } from "../common/types/HybridCommand";
import { log } from "../common/logger";
import { sendToLogChannel } from "../utils/sendToLogChannel";
import { getUserHalloweenInventory } from "../utils/getUserHalloweenInventory";
import { isDevEnv } from "../common/constants/common";
import { getOneRandomlyFromArray } from "../utils/randomUtils";

const CANDY_EMOTES = ["🍬", "🍭", "🍫"];
// TODO: Maintain start and end dates at a central place. Only halloween now so we keep them here
const START_DATE = new Date("2023-10-01T00:00:00.000+09:00");
const END_DATE = new Date("2023-10-31T23:59:59.000+09:00");

const candiesFn = async (member: GuildMember) => {
    if (member == null) {
        log.error(sendToLogChannel("[Shop] Could not find member"));
        return "An error occurred!";
    }

    const currDate = Date.now();
    if (!isDevEnv && (currDate < START_DATE.getTime() || currDate > END_DATE.getTime())) {
        return "Coins are only accessible during certain events";
    }

    const userHalloweenInventory = await getUserHalloweenInventory(member.user);
    const candies = userHalloweenInventory.candies;
    const emote = getOneRandomlyFromArray(CANDY_EMOTES);
    return `${emote} Total Candies: ${candies}`;
}

const legacy = async (message: Message, args: string[]) => {
    let res = await candiesFn(message.member);
    await message.reply(res);
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const member = (interaction.member as GuildMember);
    let res: string = await candiesFn(member);
    await interaction.editReply(res);
}

export const candies: HybridCommand = {
    info: {
        name: "candies",
        description: "(Events Only) Get current number of candies"
    },
    legacy: async (message: Message, args: any[]) => await legacy(message, args),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
}