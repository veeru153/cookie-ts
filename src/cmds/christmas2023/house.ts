import { Message, ChatInputCommandInteraction, GuildMember } from "discord.js";
import Scope from "../../common/enums/Scope";
import { HybridCommand } from "../../common/types/HybridCommand";
import { getHouseProgress } from "../../services/events/christmasService2023";
import { START_DATE, END_DATE } from "../../common/constants/christmas2023";
import { isDevEnv } from "../../common/constants/common";

const getHouseProgressWrapper = (member: GuildMember) => {
    const currDate = Date.now();
    if (!isDevEnv && (currDate < START_DATE.toMillis() || currDate > END_DATE.toMillis())) {
        return "Gingebread House is only accessible during certain events.";
    }

    return getHouseProgress(member);
}

const legacy = async (message: Message, args: string[]) => {
    const ack = await message.channel.send(`Checking Gingerbread House progress...`);
    const res = await getHouseProgressWrapper(message.member);
    ack.deletable && await ack.delete();
    await message.reply(res);
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const author = interaction.member as GuildMember;
    const res = await getHouseProgressWrapper(author);
    await interaction.editReply(res);
}

export const house: HybridCommand = {
    info: {
        name: "house",
        description: "(Christmas 2023) Check Gingerbread House progress"
    },
    legacy: async (message: Message, args: string[]) => await legacy(message, args),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
    scope: [Scope.ADMIN]
}