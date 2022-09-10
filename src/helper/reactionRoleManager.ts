import { Message, MessageReaction, User } from "discord.js";
import BiasRole from "../entities/BiasRole";
import { BiasEmbeds, BiasRoles, Errors } from "../util/constants";

export const ADD_ROLE = "ADD_ROLE";
export const REMOVE_ROLE = "REMOVE_ROLE";

export const reactionRoleHandler = async (reaction: MessageReaction, user: User, action: string) => {
    const message = await reaction.message.fetch();

    if(!(Object.values(BiasEmbeds) as String[]).includes(message.id)) return;

    const currUser = await reaction.message.guild.members.fetch(user);
    const emoji = reaction.emoji.name;
    let biasRole: BiasRole;

    if(message.id === BiasEmbeds.MAIN)
        biasRole = Object.values(BiasRoles.Main).filter(r => r.emoji === emoji)[0];
    else
        biasRole = Object.values(BiasRoles.Sub).filter(r => r.emoji === emoji)[0];

    const role = await reaction.message.guild.roles.fetch(biasRole.id);

    let res: Message;
    switch(action) {
        case ADD_ROLE: 
            currUser.roles.add(role);
            res = await reaction.message.channel.send(`${user.toString()} Role Added: \`${biasRole.name}\``);
            setTimeout(() => { res.delete() }, 5000);
            break;

        case REMOVE_ROLE:
            currUser.roles.remove(role);
            res = await reaction.message.channel.send(`${user.toString()} Role Removed: \`${biasRole.name}\``);
            setTimeout(() => { res.delete() }, 5000);
            break;

        default:
            throw new Error(Errors.ROLE_REACTION_UNKNOWN_ACTION);
    }
}

