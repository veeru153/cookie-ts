import { Client, Message } from "discord.js";
import { PREFIX } from "../util/config";
import * as cmds from "../cmds";
import handleError from "../util/handleError";
import updateServerAge from "../helper/updateServerAge";
import updateChatXp from "../helper/updateChatXp";

export const messageCreate = async (client: Client, message: Message) => {
    await updateServerAge(client);
    if(message.author.bot) return;
    await updateChatXp(message);
    if(!message.content.startsWith(PREFIX)) return;

    let msg = message.content.slice(PREFIX.length).split(" ");
    let cmd = msg.shift();
    let args = [...msg];

    if(Object.keys(cmds).includes(cmd)) {
        try {
            (cmds[cmd])._invoke(client, message, args);
        } catch (err) {
            handleError(client, err);
        }
    }
}

export const messageDelete = async (client: Client, message: Message) => {
    await updateServerAge(client);
}

export const messageUpdate = async (client: Client, message: Message) => {
    await updateServerAge(client);
}

