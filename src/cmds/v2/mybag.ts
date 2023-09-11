import { getInventoryLinkForUserId } from "../../helpers/getInventoryLinkForUserId";
import { HybridCommand } from "../../utils/types/HybridCommand";
import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js";

const myBagFn = (member: GuildMember) => {
    const url = getInventoryLinkForUserId(member.id);
    return `🎒 Inventory: ${url}`;
}

const legacy = (message: Message) => {
    message.reply(myBagFn(message.member));
}

const slash = (interaction: ChatInputCommandInteraction) => {
    interaction.reply(myBagFn(interaction.member as GuildMember))
}

export const inventory: HybridCommand = {
    info: {
        name: "mybag",
        description: "Returns link to user's inventory."
    },
    legacy: legacy,
    slash: slash,
}