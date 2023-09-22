import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { validateAndPatchInventory } from "../utils/validateAndPatchInventory";
import { inventoryRepo } from "../common/repos";
import { HybridCommand } from "../common/types/HybridCommand";

const cookiesFn = async (member: GuildMember) => {
    let userInv = await inventoryRepo.get(member.id);
    userInv = await validateAndPatchInventory(member.id, userInv);
    return `🍪 Total Cookies: ${userInv.cookies}`;
}

const legacy = async (message: Message) => {
    message.reply(await cookiesFn(message.member));
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    interaction.reply(await cookiesFn(interaction.member as GuildMember))
}

export const cookies: HybridCommand = {
    info: {
        name: "cookies",
        description: "(Alias: wallet) Get number of cookies"
    },
    legacy: async (message: Message) => await legacy(message),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
}