import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { validateAndPatchInventory } from "../utils/validateAndPatchInventory";
import { inventoryRepo } from "../common/repos";
import { HybridCommand } from "../common/types/HybridCommand";

const walletFn = async (member: GuildMember) => {
    let userInv = await inventoryRepo.get(member.id);
    userInv = await validateAndPatchInventory(member.id, userInv);
    return `🍪 Total Cookies: ${userInv.cookies}`;
}

const legacy = async (message: Message) => {
    message.reply(await walletFn(message.member));
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    interaction.reply(await walletFn(interaction.member as GuildMember))
}

export const wallet: HybridCommand = {
    info: {
        name: "wallet",
        description: "(Alias: cookies) Get number of cookies"
    },
    legacy: async (message: Message) => await legacy(message),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
}