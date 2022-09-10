import { Client, MessageReaction, User } from "discord.js";
import { reactionRoleHandler, ADD_ROLE, REMOVE_ROLE } from "../helper/reactionRoleManager";
import handleError from "../util/handleError";

export const messageReactionAddHandler = async (client: Client, reaction: MessageReaction, user: User) => {
    try {
        if(reaction.partial) reaction = await reaction.fetch();
        await reactionRoleHandler(reaction, user, ADD_ROLE);
    } catch (err) {
        handleError(client, err);
    }
}

export const messageReactionRemoveHandler = async (client: Client, reaction: MessageReaction, user: User) => {
    try {
        if(reaction.partial) reaction = await reaction.fetch();
        await reactionRoleHandler(reaction, user, REMOVE_ROLE);
    } catch (err) {
        handleError(client, err);
    }
}