import { Message, TextChannel } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import logger from "../utils/logger";

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
            msg.edit({ embeds: [content] });
            logger.info(`[Embed] Updated (${msg.id}) in Channel : ${channel.name} (${channel.id})`);
            return;
        }

        channel.send({ embeds: [content] });
        logger.info(`[Embed] Sent to Channel : ${channel.name} (${channel.id})`);
    } catch (err) {
        logger.error(`[Embed] ${err}`);
    }
}

export const embed = new Command({
    name: "embed",
    desc: "Draws an embed",
    scope: [Scope.STAFF],
    fn: embedFn
})