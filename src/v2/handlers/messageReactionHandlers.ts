import { MessageReaction, User } from "discord.js";
import { addReactionRole, removeReactionRole } from "../services/reactionRoleService";
import logger from "../utils/logger";

export const messageReactionAddHandler = async (reaction: MessageReaction, user: User) => {
    try {
        if (reaction.partial) reaction = await reaction.fetch();
        await addReactionRole(reaction, user);
    } catch (err) {
        logger.error(`[MessageReactionAddHandler] ${err}`);
    }
}

export const messageReactionRemoveHandler = async (reaction: MessageReaction, user: User) => {
    try {
        if (reaction.partial) reaction = await reaction.fetch();
        await removeReactionRole(reaction, user);
    } catch (err) {
        logger.error(`[MessageReactionRemoveHandler] ${err}`);
    }
}