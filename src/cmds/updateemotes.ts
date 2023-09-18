import { ChatInputCommandInteraction, Message } from "discord.js";
import { HybridCommand } from "../common/types/HybridCommand";
import Scope from "../common/enums/Scope";
import { log } from "../common/logger";
import { sendToLogChannel } from "../utils/sendToLogChannel";
import { updateEmotes } from "../services/guildService";

const legacy = async (message: Message) => {
    log.info(sendToLogChannel(`Member: ${message.member.toString()} ran update emote job`));
    const ack = await message.reply("Updating Emotes...");
    await updateEmotes();
    ack.deletable && await ack.delete();
    await message.reply("Emotes Updated!");
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply()
    log.info(sendToLogChannel(`Member: ${interaction.member.toString()} ran update emote job`));
    await updateEmotes();
    await interaction.editReply("Emotes Updated!");
}

export const updateemotes: HybridCommand = {
    info: {
        name: "updateemotes",
        description: "Update #emotes"
    },
    legacy: async (message: Message) => await legacy(message),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
    scope: [Scope.STAFF]
}