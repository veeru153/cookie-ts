import { GuildEmoji, GuildMember, Message, MessageReaction, User } from "discord.js";
import { messageCreate, messageDelete, messageUpdate } from "./eventHandlers/messageHandlers";
import { emojiHandler, Action } from "./eventHandlers/emojiHandlers";
import { guildMemberAddHandler } from "./eventHandlers/guildMemberHandler";
import { messageReactionAddHandler, messageReactionRemoveHandler } from "./eventHandlers/messageReactionHandlers";
import isDevEnv from "./util/isDevEnv";
import client from "./util/client";

client.on("ready", () => {
    const env = process.env.NODE_ENV == "dev" ? "Development" : "Production";
    const identity = process.env.NODE_ENV == "dev" ? "Cookie Dough" : "Cookie";
    console.log(`READY! Logged in as ${identity}.`);
    console.log(`- Environment: ${env}`);
})

isDevEnv() && client.on("error", console.log);
isDevEnv() && client.on("debug", console.log);
client.on("messageCreate", async (message: Message) => { messageCreate(client, message) });
client.on("messageDelete", async (message: Message) => { messageDelete(client, message) });
client.on("messageUpdate", async (message: Message) => { messageUpdate(client, message) });
client.on("emojiCreate", async (emoji: GuildEmoji) => { emojiHandler(client, emoji, Action.ADD) });
client.on("emojiDelete", async (emoji: GuildEmoji) => { emojiHandler(client, emoji, Action.REMOVE) });
client.on("emojiUpdate", async (_: GuildEmoji, newEmoji: GuildEmoji) => { emojiHandler(client, newEmoji, Action.UPDATE) });
client.on("guildMemberAdd", async (member: GuildMember) => { guildMemberAddHandler(client, member) });
client.on("messageReactionAdd", async (reaction: MessageReaction, user: User) => { 
    messageReactionAddHandler(client, reaction, user) 
})
client.on("messageReactionRemove", async (reaction: MessageReaction, user: User) => { 
    messageReactionRemoveHandler(client, reaction, user) 
})