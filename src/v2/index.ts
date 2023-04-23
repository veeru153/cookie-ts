import { Events, GuildEmoji, GuildMember, Message, MessageReaction, User } from "discord.js";
import client from "./utils/client";
import { env, identity, isDevEnv } from "./utils/constants";
import logger from "./utils/logger";
import * as repos from "./utils/repos";
import { messageCreate, messageDelete, messageUpdate } from "./handlers/messageHandlers";
import { messageReactionAddHandler, messageReactionRemoveHandler } from "./handlers/messageReactionHandlers";
import { guildMemberAddHandler } from "./handlers/guildMemberHandlers";
import { emojiAddHandler, emojiRemoveHandler, emojiUpdateHandler } from "./handlers/emojiHandlers";
import { server } from "./server";

client.on(Events.ClientReady, async () => {
    console.log(`READY! Logged in as ${identity}.`);
    console.log(`- Environment: ${env}`);
    logger.info(`${identity} is online!`);
    // TODO: Event Service
    // EventService.triggerEvent();
    for (let repo of Object.values(repos)) {
        await repo.initialize();
    }
    server();
})

isDevEnv && client.on(Events.Error, console.log);
isDevEnv && client.on(Events.Debug, console.log);

client.on(Events.MessageCreate, async (message: Message) => await messageCreate(message));
client.on(Events.MessageDelete, async (message: Message) => await messageDelete(message));
client.on(Events.MessageUpdate, async (message: Message) => await messageUpdate(message));

client.on(Events.GuildEmojiCreate, async (emoji: GuildEmoji) => await emojiAddHandler(emoji));
client.on(Events.GuildEmojiDelete, async (emoji: GuildEmoji) => await emojiRemoveHandler(emoji));
client.on(Events.GuildEmojiUpdate, async (_: GuildEmoji, newEmoji: GuildEmoji) => await emojiUpdateHandler(newEmoji));

client.on(Events.GuildMemberAdd, async (member: GuildMember) => await guildMemberAddHandler(member));

client.on(Events.MessageReactionAdd, async (reaction: MessageReaction, user: User) => {
    await messageReactionAddHandler(reaction, user)
})
client.on(Events.MessageReactionRemove, async (reaction: MessageReaction, user: User) => {
    await messageReactionRemoveHandler(reaction, user)
})

// server();