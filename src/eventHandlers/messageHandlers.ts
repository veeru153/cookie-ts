import { Client, Message } from "discord.js";
import { PREFIX } from "../util/config";
import * as cmds from "../cmds";

export const messageCreate = async (client: Client, message: Message) => {
    // TODO: server age handler
    if(message.author.bot) return;
    if(!message.content.startsWith(PREFIX)) {
        // TODO: xp handler
        return;
    }

    let msg = message.content.slice(PREFIX.length).split(" ");
    let cmd = msg.shift();
    let args = [...msg];

    if(Object.keys(cmds).includes(cmd)) 
        (cmds[cmd])._invoke(client, message, args);
}

export const messageDelete = (message: Message) => {
    // server age handler
}

export const messageUpdate = (message: Message) => {
    // server age handler
}

