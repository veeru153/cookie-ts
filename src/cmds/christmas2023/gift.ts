import { ApplicationCommandOptionType, Message, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { HybridCommand } from "../../common/types/HybridCommand";
import { giftMember } from "../../services/events/christmasService2023";
import { CookieException } from "../../common/CookieException";
import { isDevEnv } from "../../common/constants/common";
import { END_DATE, START_DATE } from "../../common/constants/christmas2023";
import { log } from "../../common/logger";
import { sendToLogChannel } from "../../utils/sendToLogChannel";

const giftMemberWrapper = async (sender: GuildMember, receiver: GuildMember) => {
    const currDate = Date.now();
    if (!isDevEnv && (currDate < START_DATE.toMillis() || currDate > END_DATE.toMillis())) {
        return "Gifting is only accessible during certain events.";
    }

    try {
        return await giftMember(sender, receiver);
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
    if (args == null || args.length != 2) {
        throw new CookieException("Please enter valid parameters: `@member`");
    }

    const mentionAsString = args[0];
    if (!mentionAsString.match(/<@\d+/)) {
        throw new CookieException("Please mention a member");
    }

    const member = message.mentions.members.first();
    const ack = await message.channel.send(`Sending gift...`);
    const res = await giftMemberWrapper(message.member, member);
    ack.deletable && await ack.delete();
    await message.reply(res);
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const author = interaction.member as GuildMember;
    const member = interaction.options.getMember("user") as GuildMember;
    const res = await giftMemberWrapper(author, member);
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
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction)
}