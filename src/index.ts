import { GuildEmoji, GuildMember, Message, MessageReaction, User } from "discord.js";
import { messageCreate, messageDelete, messageUpdate } from "./eventHandlers/messageHandlers";
import { emojiHandler, Action } from "./eventHandlers/emojiHandlers";
import { guildMemberAddHandler } from "./eventHandlers/guildMemberHandler";
import { messageReactionAddHandler, messageReactionRemoveHandler } from "./eventHandlers/messageReactionHandlers";
import isDevEnv from "./util/isDevEnv";
import client from "./util/client";
import { server } from "./server";
import logger from "./util/logger";
import EventService from "./services/eventService";
import * as repos from "./util/collections";

client.on("ready", () => {
    const env = process.env.NODE_ENV == "dev" ? "Development" : "Production";
    const identity = process.env.NODE_ENV == "dev" ? "Cookie Dough" : "Cookie";
    console.log(`READY! Logged in as ${identity}.`);
    console.log(`- Environment: ${env}`);
    logger.info(`${identity} is online!`);
    EventService.__triggerEvent();
    for(let repo of Object.values(repos)) {
        repo.initialize();
    }
})

isDevEnv() && client.on("error", console.log);
isDevEnv() && client.on("debug", console.log);

client.on("messageCreate", async (message: Message) => { messageCreate(message) });
client.on("messageDelete", async (message: Message) => { messageDelete(message) });
client.on("messageUpdate", async (message: Message) => { messageUpdate(message) });
client.on("emojiCreate", async (emoji: GuildEmoji) => { emojiHandler(emoji, Action.ADD) });
client.on("emojiDelete", async (emoji: GuildEmoji) => { emojiHandler(emoji, Action.REMOVE) });
client.on("emojiUpdate", async (_: GuildEmoji, newEmoji: GuildEmoji) => { 
    emojiHandler(newEmoji, Action.UPDATE)
});
client.on("guildMemberAdd", async (member: GuildMember) => { guildMemberAddHandler(member) });
client.on("messageReactionAdd", async (reaction: MessageReaction, user: User) => { 
    messageReactionAddHandler(reaction, user) 
})
client.on("messageReactionRemove", async (reaction: MessageReaction, user: User) => { 
    messageReactionRemoveHandler(reaction, user) 
})

server();