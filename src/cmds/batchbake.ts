import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { HybridCommand } from "../utils/types/HybridCommand";
import Scope from "../utils/enums/Scope";
import { BATCH_BAKE_COUNT_MIN, BATCH_BAKE_COUNT_MAX } from "../utils/constants/bake";
import { CookieException } from "../utils/CookieException";
import { batchBakeCookies } from "../services/bakeService";

const legacy = async (message: Message, args: string[]) => {
    if (args == null || args.length != 2) {
        throw new CookieException("Please enter valid parameters: `@member count`");
    }

    const mentionAsString = args[0];
    const count = parseInt(args[1]);
    if (!mentionAsString.match(/<@\d+/)) {
        throw new CookieException("Please mention a member");
    }
    if (count < BATCH_BAKE_COUNT_MIN || count > BATCH_BAKE_COUNT_MAX) {
        throw new CookieException(`Invalid Count: ${count}. Count must be in range 1-10.`);
    }

    const member = message.mentions.members.first();
    const batchStr = count === 1 ? "batch" : "batches"
    const ack = await message.channel.send(`Baking ${count} ${batchStr} for ${member.toString()}...`);
    const res = await batchBakeCookies(member, count);
    ack.deletable && await ack.delete();
    await message.reply(res);
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply()
    const member = interaction.options.getMember("user") as GuildMember;
    const count = interaction.options.getInteger("count");

    if (count < BATCH_BAKE_COUNT_MIN || count > BATCH_BAKE_COUNT_MAX) {
        throw new CookieException(`Invalid Count: ${count}. Count must be in range 1-10.`);
    }

    const res = await batchBakeCookies(member, count);
    await interaction.editReply(res);
}

export const batchbake: HybridCommand = {
    info: {
        name: "batchbake",
        description: "Bake missed batches (due to downtime)",
        options: [
            {
                name: "user",
                description: "User who the batches are to be baked for",
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: "count",
                description: "Number of batches to be baked",
                type: ApplicationCommandOptionType.Integer,
                required: true,
                min_value: BATCH_BAKE_COUNT_MIN,
                max_value: BATCH_BAKE_COUNT_MAX,
            }
        ]
    },
    legacy: async (message: Message, args: string[]) => await legacy(message, args),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
    scope: [Scope.ADMIN]
}