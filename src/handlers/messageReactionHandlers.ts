import { MessageReaction, User } from "discord.js";
import { addReactionRole, removeReactionRole } from "../services/reactionRoleService";
import { log } from "../common/logger";
import { sendToLogChannel } from "../utils/sendToLogChannel";

export const messageReactionAddHandler = async (reaction: MessageReaction, user: User) => {
    try {
        if (reaction.partial) reaction = await reaction.fetch();
        await addReactionRole(reaction, user);
    } catch (err) {
        log.error(sendToLogChannel(`[MessageReactionAddHandler] ${err}`));
    }
}

export const messageReactionRemoveHandler = async (reaction: MessageReaction, user: User) => {
    try {
        if (reaction.partial) reaction = await reaction.fetch();
        await removeReactionRole(reaction, user);
    } catch (err) {
        log.error(sendToLogChannel(`[MessageReactionRemoveHandler] ${err}`));
    }
}