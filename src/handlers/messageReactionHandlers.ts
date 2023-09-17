import { MessageReaction, User } from "discord.js";
import { addReactionRole, removeReactionRole } from "../services/reactionRoleService";
import { log } from "../common/logger";
import { sendToLogChannel } from "../utils/sendToLogChannel";
import { handleStars } from "../services/starboardService";

export const messageReactionAddHandler = async (reaction: MessageReaction, user: User) => {
    try {
        if (reaction.partial) reaction = await reaction.fetch();
        await addReactionRole(reaction, user);
        await handleStars(reaction, user);
    } catch (err) {
        log.error(err, sendToLogChannel(`[MessageReactionAddHandler] ${err}`));
    }
}

export const messageReactionRemoveHandler = async (reaction: MessageReaction, user: User) => {
    try {
        if (reaction.partial) reaction = await reaction.fetch();
        await removeReactionRole(reaction, user);
        await handleStars(reaction, user);
    } catch (err) {
        log.error(err, sendToLogChannel(`[MessageReactionRemoveHandler] ${err}`));
    }
}