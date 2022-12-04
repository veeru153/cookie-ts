import { GuildMember, Message } from "discord.js";
import Scope from "../util/scope";
import Command from "./_Command";

export const whois = new Command({
    name: "whois",
    desc: "Returns information about a user",
    scope: [ Scope.STAFF ]
})

whois.run = async (message: Message, args: string[]) => {
    if(message.mentions.users.size > 0) {
        const res = getMemberInfo(message.mentions.members.first());
        message.reply(res);
        return;
    }

    if(args.length > 0) {
        const memberById = message.guild.members.cache.get(args[0]);
        if(memberById) {
            const res = getMemberInfo(memberById);
            message.reply(res);
            return;
        } else {
            message.reply("Invalid arguments! Check your inputs");
            return;
        }
    }

    const res = getMemberInfo(message.member);
    message.reply(res);
}

const getMemberInfo = (member: GuildMember) => {
    let res = "";
    
    const { user, nickname, joinedTimestamp } = member;
    const { tag, createdTimestamp, id } = user;

    res += `**${nickname}** - ${tag} \`${id}\`\n`;
    res += `__Joined at:__ <t:${Math.floor(joinedTimestamp/1000)}:f>\n`;
    res += `__Created at:__ <t:${Math.floor(createdTimestamp/1000)}:f>\n`;

    return res;
}