import { getInventoryLinkForUserId } from "../../helpers/getInventoryLinkForUserId";
import { HybridCommand } from "../../utils/types/HybridCommand";
import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js";

const inventoryFn = (member: GuildMember) => {
    const url = getInventoryLinkForUserId(member.id);
    return `🎒 Inventory: ${url}`;
}

const legacy = async (message: Message) => {
    message.reply(inventoryFn(message.member));
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    interaction.reply(inventoryFn(interaction.member as GuildMember))
}

export const inventory: HybridCommand = {
    info: {
        name: "inventory",
        description: "(Alias: mybag) Returns link to user's inventory."
    },
    legacy: async (message: Message) => await legacy(message),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
}