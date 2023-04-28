import { Message, TextChannel } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { log } from "../utils/logger";
import { sendToLogChannel } from "../helpers/sendToLogChannel";
import { getChannelMentionFromId } from "../helpers/getChannelMentionFromId";
import { getUserLogString } from "../helpers/getUserLogString";

const embedFn = async (message: Message, args: string[]) => {
    try {
        const isDiffChannel = ["-c", "--channel"].includes(args[0]);
        let channel: TextChannel = null;
        if (isDiffChannel) {
            channel = message.mentions.channels.first() as TextChannel;
            args.splice(0, 2);
        } else {
            channel = message.channel as TextChannel;
        }

        const isEdit = ["-e", "--edit"].includes(args[0]);
        let msg: Message = null;
        if (isEdit) {
            const msgId = args[1];
            msg = await channel.messages.fetch(msgId);
            args.splice(0, 2);
        }

        const content = JSON.parse(args.join(" "));

        if (isEdit) {
            log.info(sendToLogChannel(`[Embed] Updating (${msg.id}) in Channel : ${getChannelMentionFromId(channel.id)} by  User: ${getUserLogString(message.author)}\nContent: ${content}`));
            msg.edit({ embeds: [content] });
            await message.reply("Embed updated!");
            return;
        }

        channel.send({ embeds: [content] });
        log.info(sendToLogChannel(`[Embed] Sent to Channel : ${getChannelMentionFromId(channel.id)} by User : ${getUserLogString(message.author)}\nContent : ${content}`));
        await message.reply("Embed sent!");
    } catch (err) {
        await message.reply("Error while sending/updating embed!");
        log.error(sendToLogChannel(`[Embed] Error : ${err}`));
    }
}

export const embed = new Command({
    name: "embed",
    desc: "Draws an embed",
    scope: [Scope.STAFF],
    fn: embedFn
})