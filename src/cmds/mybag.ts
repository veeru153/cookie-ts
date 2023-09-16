import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { getInventoryLinkForUserId } from "../helpers/getInventoryLinkForUserId";
import { HybridCommand } from "../utils/types/HybridCommand";

const myBagFn = (member: GuildMember) => {
    const url = getInventoryLinkForUserId(member.id);
    return `🎒 Inventory: ${url}`;
}

const legacy = async (message: Message) => {
    message.reply(myBagFn(message.member));
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    interaction.reply(myBagFn(interaction.member as GuildMember))
}

export const mybag: HybridCommand = {
    info: {
        name: "mybag",
        description: "(Alias: inventory) Get link to inventory"
    },
    legacy: async (message: Message) => await legacy(message),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
}