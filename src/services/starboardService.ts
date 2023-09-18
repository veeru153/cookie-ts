import { ChannelType, EmbedBuilder, Message, MessageReaction, TextChannel, User } from "discord.js";
import { Channels } from "../common/enums/Channels";
import { log } from "../common/logger";
import { sendToLogChannel } from "../utils/sendToLogChannel";
import { isDevEnv } from "../common/constants/common";
import { getOneRandomlyFromArray } from "../utils/randomUtils";

const EMOJI = "⭐";
const THRESHOLD = isDevEnv ? 1 : 3;
const MESSAGE_FETCH_LIMIT = 100;
const EMBED_HEX = "#ffac33";
const CHANNEL_ID = isDevEnv ? Channels.Cookie.STARBOARD_TEST : Channels.Cookieland.STARBOARD;
const CALLOUT = true;
const CALLOUT_EMOJIS = [
    "<:yuqibruh:758345439119540245>",
    "<:yuqiweird:688771937236942990>",
    "<:yuqireally:697371883343183922>",
]

export const handleStars = async (reaction: MessageReaction, user: User) => {
    if (reaction.emoji.name !== EMOJI || reaction.count < THRESHOLD) {
        return;
    }

    let message = reaction.message;
    if (message.partial) {
        message = await message.fetch();
    }

    if (message.author === user) {
        if (CALLOUT) {
            const emoji = getOneRandomlyFromArray(CALLOUT_EMOJIS);
            message.channel.send(`${user.toString()} Did you really just star your own message? ${emoji}`);
        }
        return;
    }

    const channel = await message.guild.channels.fetch(CHANNEL_ID);

    if (message.channel === channel) {
        return;
    }

    if (channel.type !== ChannelType.GuildText) {
        log.warn(sendToLogChannel(`Starboard channel: ${channel.toString} is not a Text Channel. Not handling stars!`));
        return;
    }

    const starEmbeds = getEmbed(message as Message, reaction.count);
    if (starEmbeds == null || starEmbeds.length === 0) {
        log.info("[Starboard Service] No embeds received to send. Skipping.");
        return;
    }
    const messagePayload = { content: message.url, embeds: starEmbeds };
    const prevStarEmbed = await getPrevStarEmbed(message as Message, channel);

    if (prevStarEmbed == null) {
        await channel.send(messagePayload);
    } else {
        await prevStarEmbed.edit(messagePayload);
    }
}

const getPrevStarEmbed = async (starredMessage: Message, channel: TextChannel) => {
    const messages = await channel.messages.fetch({ limit: MESSAGE_FETCH_LIMIT });
    return messages.find(message => message.content.includes(starredMessage.id));
}

const getEmbed = (message: Message, starCount: number) => {
    let desc = message.content;
    const attachments = message.attachments;
    if (desc.length === 0 && attachments.size > 0) {
        desc = `Attachments: ${message.attachments.size}`;
    }

    if (desc.length === 0) {
        log.warn(`[Starboard Service] Could not find any description. Skipping. Message Id: ${message.id}`);
        return null;
    }

    const embeds: EmbedBuilder[] = [];
    const firstEmbed = new EmbedBuilder()
        .setURL(message.url)
        .setColor(EMBED_HEX)
        .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
        .setDescription(desc ?? "")
        .setFooter({ text: `⭐ ${starCount}` })
        .setTimestamp(message.createdTimestamp);

    embeds.push(firstEmbed);

    for (let i = 0; i < attachments.size; i++) {
        if (i === 0) {
            embeds[0].setImage(attachments.at(0).url);
        } else {
            const embed = new EmbedBuilder().setURL(message.url).setImage(attachments.at(i).url);
            embeds.push(embed);
        }
    }

    return embeds;
}