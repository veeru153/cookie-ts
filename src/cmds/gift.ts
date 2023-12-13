import { ApplicationCommandOptionType, Message, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { BATCH_BAKE_COUNT_MIN, BATCH_BAKE_COUNT_MAX } from "../common/constants/bake";
import Scope from "../common/enums/Scope";
import { HybridCommand } from "../common/types/HybridCommand";
import { giftMember } from "../services/events/christmasService2023";
import { CookieException } from "../common/CookieException";

const legacy = async (message: Message, args: string[]) => {
    if (args == null || args.length != 2) {
        throw new CookieException("Please enter valid parameters: `@member`");
    }

    const mentionAsString = args[0];
    if (!mentionAsString.match(/<@\d+/)) {
        throw new CookieException("Please mention a member");
    }

    const member = message.mentions.members.first();
    const ack = await message.channel.send(`Sending gift...`);
    const res = await giftMember(message.member, member);
    ack.deletable && await ack.delete();
    await message.reply(res);
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const author = interaction.member as GuildMember;
    const member = interaction.options.getMember("user") as GuildMember;
    const res = await giftMember(author, member);
    await interaction.editReply(res);
}

export const gift: HybridCommand = {
    info: {
        name: "gift",
        description: "(Christmas 2023) Gift a member",
        options: [
            {
                name: "user",
                description: "Member who you wish to send a gift to",
                type: ApplicationCommandOptionType.User,
                required: true
            },
        ]
    },
    legacy: async (message: Message, args: string[]) => await legacy(message, args),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
    scope: [Scope.ADMIN]
}