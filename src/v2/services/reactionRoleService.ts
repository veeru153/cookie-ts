import { MessageReaction, User } from "discord.js";
import { BiasRoles } from "../utils/enums/BiasRoles";
import { BiasEmbeds } from "../utils/enums/Embeds";

const RoleMsgIds = [BiasEmbeds.MAIN, BiasEmbeds.SUB] as string[];

const enum RoleAction {
    ADD_ROLE,
    REMOVE_ROLE
}

export const addReactionRole = async (reaction: MessageReaction, user: User) => {
    handleReactionRole(reaction, user, RoleAction.ADD_ROLE);
}

export const removeReactionRole = async (reaction: MessageReaction, user: User) => {
    handleReactionRole(reaction, user, RoleAction.REMOVE_ROLE);
}

const handleReactionRole = async (reaction: MessageReaction, user: User, action: RoleAction) => {
    if (!RoleMsgIds.includes(reaction.message.id)) return;
    const member = await reaction.message.guild.members.fetch(user);
    let biasRole = await getBiasRole(reaction);
    const role = await reaction.message.guild.roles.fetch(biasRole.id);

    if (action === RoleAction.ADD_ROLE)
        member.roles.add(role);
    if (action === RoleAction.REMOVE_ROLE)
        member.roles.remove(role);

    const ackMessage = await reaction.message.channel.send(`${user.toString()} Role Added: \`${biasRole.name}\``);
    setTimeout(() => { ackMessage.delete() }, 5000);
}

const getBiasRole = async (reaction: MessageReaction) => {
    const message = await reaction.message.fetch();
    const emoji = reaction.emoji.name;
    if (message.id === BiasEmbeds.MAIN)
        return Object.values(BiasRoles.Main).filter(r => r.emoji === emoji)[0];
    else if (message.id === BiasEmbeds.SUB)
        return Object.values(BiasRoles.Sub).filter(r => r.emoji === emoji)[0];
}