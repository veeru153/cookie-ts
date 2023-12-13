import { Message, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { HybridCommand } from "../../common/types/HybridCommand";
import { claimReward } from "../../services/events/christmasService2023";
import { CookieException } from "../../common/CookieException";
import { log } from "../../common/logger";
import { sendToLogChannel } from "../../utils/sendToLogChannel";

const claimWrapper = async (member: GuildMember) => {
    try {
        return await claimReward(member)
    } catch (ex) {
        if (ex instanceof CookieException) {
            return ex.message;
        } else {
            log.error(sendToLogChannel(ex.message));
            return "Unexpected error occurred!";
        }
    }
}

const legacy = async (message: Message, args: string[]) => {
    const res = await claimWrapper(message.member);
    await message.reply(res);
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const author = interaction.member as GuildMember;
    const res = await claimWrapper(author);
    await interaction.editReply(res);
}

export const claim: HybridCommand = {
    info: {
        name: "claim",
        description: "(Christmas 2023) Claim Reward"
    },
    legacy: async (message: Message, args: string[]) => await legacy(message, args),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction)
}