import { Events, GuildEmoji, GuildMember, Interaction, Message, MessageReaction, User } from "discord.js";
import client from "./utils/client";
import { env, identity, isDevEnv } from "./utils/constants/common";
import * as repos from "./utils/repos";
import { messageCreate, messageDelete, messageUpdate } from "./handlers/messageHandlers";
import { messageReactionAddHandler, messageReactionRemoveHandler } from "./handlers/messageReactionHandlers";
import { guildMemberAddHandler } from "./handlers/guildMemberHandlers";
import { emojiAddHandler, emojiRemoveHandler, emojiUpdateHandler } from "./handlers/emojiHandlers";
import { server } from "./server";
import { log } from "./utils/logger";
import { sendToLogChannel } from "./helpers/sendToLogChannel";
import { interactionCreate } from "./handlers/interactionHandlers";
import { syncCommands } from "./services/interactionService";

client.on(Events.ClientReady, async () => {
    log.info(`Starting ${identity}...`);
    Object.values(repos).forEach(repo => repo.initialize());
    log.info(sendToLogChannel('Repositories Initialized!'));
    await syncCommands();
    server();
    log.info(`READY! Logged in as ${identity}.`);
    log.info(`- Environment: ${env}`);
    log.info(sendToLogChannel(`${identity} is online!`));
})

isDevEnv && client.on(Events.Error, console.log);
isDevEnv && client.on(Events.Debug, console.log);

client.on(Events.MessageCreate, async (message: Message) => await messageCreate(message));
client.on(Events.MessageDelete, async (message: Message) => await messageDelete(message));
client.on(Events.MessageUpdate, async (message: Message) => await messageUpdate(message));

client.on(Events.InteractionCreate, async (interaction: Interaction) => await interactionCreate(interaction));

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