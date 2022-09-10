import { Message, MessageReaction, User } from "discord.js";
import logger from "../util/logger";
import BiasRole from "../entities/BiasRole";
import { BiasEmbeds, BiasRoles, Errors } from "../util/constants";

export const ADD_ROLE = "ADD_ROLE";
export const REMOVE_ROLE = "REMOVE_ROLE";

const RoleMsgIds = [BiasEmbeds.MAIN, BiasEmbeds.SUB] as string[];

export const reactionRoleHandler = async (reaction: MessageReaction, user: User, action: string) => {
    if(!RoleMsgIds.includes(reaction.message.id)) return;
    const message = await reaction.message.fetch();
    
    const { username, discriminator, id } = user;
    logger.info(`[Role Reaction] ${username}#${discriminator} (${id}) reacted : ${reaction.emoji.name}: on ${message.id}`);

    if(!(Object.values(BiasEmbeds) as String[]).includes(message.id)) return;

    const currUser = await reaction.message.guild.members.fetch(user);
    const emoji = reaction.emoji.name;
    let biasRole: BiasRole;

    if(message.id === BiasEmbeds.MAIN)
        biasRole = Object.values(BiasRoles.Main).filter(r => r.emoji === emoji)[0];
    else if(message.id === BiasEmbeds.SUB)
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
            logger.error(`[Role Reaction] ${Errors.ROLE_REACTION_UNKNOWN_ACTION}`);
    }
}

