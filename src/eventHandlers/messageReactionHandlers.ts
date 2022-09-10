import { Client, MessageReaction, User } from "discord.js";
import logger from "../util/logger";
import { reactionRoleHandler, ADD_ROLE, REMOVE_ROLE } from "../helper/reactionRoleManager";

export const messageReactionAddHandler = async (client: Client, reaction: MessageReaction, user: User) => {
    try {
        if(reaction.partial) reaction = await reaction.fetch();
        await reactionRoleHandler(reaction, user, ADD_ROLE);
    } catch (err) {
        logger.error(`[MessageReactionAddHandler] ${err}`);
    }
}

export const messageReactionRemoveHandler = async (client: Client, reaction: MessageReaction, user: User) => {
    try {
        if(reaction.partial) reaction = await reaction.fetch();
        await reactionRoleHandler(reaction, user, REMOVE_ROLE);
    } catch (err) {
        logger.error(`[MessageReactionRemoveHandler] ${err}`);
    }
}