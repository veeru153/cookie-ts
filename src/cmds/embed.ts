import { EmbedBuilder } from "discord.js";
import { Client, Message, Channel } from "discord.js";
import handleError from "../util/handleError";
import Scope from "../util/scope";
import Command from "./_Command";

export const embed = new Command({
    name: "embed",
    desc: "Draws an embed",
    scope: [ Scope.STAFF ]
})

embed.run = async (client: Client, message: Message, args: string[]) => {
    try {
        const isDiffChannel = ["-c", "--channel"].includes(args[0]);
        let channel = null;
        if(isDiffChannel) {
            channel = message.mentions.channels.first();
            args.splice(0, 2);
        } else {
            channel = message.channel;
        }
        
        const isEdit = ["-e", "--edit"].includes(args[0]);
        let msg: Message = null;
        if(isEdit) {
            const msgId = args[1];
            msg = await channel.messages.fetch(msgId);
            args.splice(0, 2);
        }
    
        const content = JSON.parse(args.join(" "));
        
        if(isEdit) {
            msg.edit({ embeds: [ content ]});
            return;
        }
    
        channel.send({ embeds: [ content ]});
    } catch (err) {
        handleError(client, err);
    }
}
