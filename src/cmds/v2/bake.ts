import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js"
import { HybridCommand } from "../../utils/types/HybridCommand"
import { bakeCookies } from "../../services/bakeService"

const bakeFn = async (member: GuildMember) => {
    return await bakeCookies(member);
}

const legacy = async (message: Message) => {
    message.reply(await bakeFn(message.member));
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    const member = (interaction.member as GuildMember);
    interaction.reply(await bakeFn(member));
}

export const bake: HybridCommand = {
    info: {
        name: "bake",
        description: "Bake Cookies 🍪",
    },
    legacy: async (message: Message) => await legacy(message),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
}