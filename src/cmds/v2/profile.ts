import { isArrayUnavailable, isStringBlank } from "../../helpers/validators";
import { HybridCommand } from "../../utils/types/HybridCommand";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { log } from "../../utils/logger";
import { sendToLogChannel } from "../../helpers/sendToLogChannel";
import { customizeProfileV2, getProfileCard } from "../../services/profileService";
import { CookieException } from "../../utils/CookieException";

enum ProfileAction {
    GET = "get",
    SET = "set"
}

// TODO: Changed commands copied from the shop to remove "background"
const setProfile = async (member: GuildMember, itemId?: string) => {
    if (member == null) {
        log.error(sendToLogChannel("[Profile] Could not find member"));
        throw new CookieException("An error occurred!");
    }

    if (isStringBlank(itemId)) {
        throw new CookieException("Please enter a valid `item_id`");
    }

    await customizeProfileV2(member.id, itemId);
    return "Profile Updated!"
}

const getProfileLegacy = async (message: Message) => {
    const ack = await message.channel.send(`Generating Profile Card for ${message.member.toString()}...`);
    const card = await getProfileCard(message.member);
    ack.deletable && await ack.delete();
    await message.reply({
        files: [{
            attachment: card,
            name: `Profile_${message.author.id}.png`
        }]
    })
}

const legacy = async (message: Message, args: string[]) => {
    let res: string = null;
    if (isArrayUnavailable(args) || args.length === 0) {
        return await getProfileLegacy(message);
    } else if (args.length === 1) {
        if (args[0] === ProfileAction.GET) {
            return await getProfileLegacy(message);
        } else if (args[0] === ProfileAction.SET) {
            res = "Please enter an `item_id`";
        } else {
            res = "Please enter a valid action: `get | set`";
        }
    } else if (args.length === 2) {
        if (args[0] === ProfileAction.SET) {
            const itemId = args[1];
            res = await setProfile(message.member, itemId);
        } else if (args[0] === ProfileAction.GET) {
            return await getProfileLegacy(message);
        } else {
            res = "Please enter a valid action: `get | set`";
        }
    }

    await message.reply(res);
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    let res: string = null;
    const action = interaction.options.getSubcommand();
    const member = (interaction.member as GuildMember);

    if (action === ProfileAction.GET) {
        const card = await getProfileCard(member);
        return await interaction.editReply({
            files: [{
                attachment: card,
                name: `Profile_${member.id}.png`
            }]
        })
    } else if (action === ProfileAction.SET) {
        const itemId = interaction.options.getString("item_id");
        res = await setProfile(member, itemId);
    } else {
        res = "Please enter a valid action: `get | set`";
    }

    interaction.editReply(res);
}

export const profile: HybridCommand = {
    info: {
        name: "profile",
        description: "A place to spend cookies to upgrade your profile",
        options: [
            {
                name: "get",
                description: "Generate profile",
                required: false,
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "set",
                description: "Equip an item with the item_id",
                required: false,
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "item_id",
                        description: "The ID of the item in the shop",
                        required: true,
                        type: ApplicationCommandOptionType.String
                    }
                ]
            },
        ]
    },
    legacy: async (message: Message, args: any[]) => await legacy(message, args),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
}