import { MessageReaction, User } from "discord.js";
import logger from "../util/logger";
import { reactionRoleService, ADD_ROLE, REMOVE_ROLE } from "../services/reactionRoleService";

export const messageReactionAddHandler = async (reaction: MessageReaction, user: User) => {
    try {
        if(reaction.partial) reaction = await reaction.fetch();
        await reactionRoleService(reaction, user, ADD_ROLE);
    } catch (err) {
        logger.error(`[MessageReactionAddHandler] ${err}`);
    }
}

export const messageReactionRemoveHandler = async (reaction: MessageReaction, user: User) => {
    try {
        if(reaction.partial) reaction = await reaction.fetch();
        await reactionRoleService(reaction, user, REMOVE_ROLE);
    } catch (err) {
        logger.error(`[MessageReactionRemoveHandler] ${err}`);
    }
}