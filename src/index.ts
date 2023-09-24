import { Events, GuildEmoji, GuildMember, Interaction, Message, MessageReaction, User } from "discord.js";
import client from "./common/client";
import { env, identity, isDevEnv } from "./common/constants/common";
import * as repos from "./common/repos";
import { messageCreate, messageDelete, messageUpdate } from "./handlers/messageHandlers";
import { messageReactionAddHandler, messageReactionRemoveHandler } from "./handlers/messageReactionHandlers";
import { guildMemberAddHandler } from "./handlers/guildMemberHandlers";
import { server } from "./server";
import { log } from "./common/logger";
import { sendToLogChannel } from "./utils/sendToLogChannel";
import { interactionCreate } from "./handlers/interactionHandlers";
import { registerCommands } from "./services/interactionService";
import { triggerEvents } from "./services/eventService";

client.on(Events.ClientReady, async () => {
    log.info(`Starting ${identity}...`);
    Object.values(repos).forEach(repo => repo != null && repo.initialize());
    log.info(sendToLogChannel('Repositories Initialized!'));
    await registerCommands();
    await triggerEvents();
    server();
    log.info(`READY! Logged in as ${identity}.`);
    log.info(`- Environment: ${env}`);
    log.info(sendToLogChannel(`${identity} is online!`));
})

isDevEnv && client.on(Events.Error, log.error);
isDevEnv && client.on(Events.Debug, log.debug);

client.on(Events.MessageCreate, async (message: Message) => await messageCreate(message));
client.on(Events.MessageDelete, async (message: Message) => await messageDelete(message));
client.on(Events.MessageUpdate, async (message: Message) => await messageUpdate(message));

client.on(Events.InteractionCreate, async (interaction: Interaction) => await interactionCreate(interaction));

client.on(Events.GuildMemberAdd, async (member: GuildMember) => await guildMemberAddHandler(member));

client.on(Events.MessageReactionAdd, async (reaction: MessageReaction, user: User) => {
    await messageReactionAddHandler(reaction, user)
})
client.on(Events.MessageReactionRemove, async (reaction: MessageReaction, user: User) => {
    await messageReactionRemoveHandler(reaction, user)
})

// server();