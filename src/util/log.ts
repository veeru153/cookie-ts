import { Client, EmbedBuilder, TextChannel, User } from "discord.js";
import Channels from "./channels";

interface Log {
    title: string,
    user?: User,
    desc?: string,
}

const log = (client: Client, { title, user, desc }: Log) => {
    const embed = new EmbedBuilder();
    embed.setTitle(title)
    user && embed.setAuthor({ name: user.username, iconURL: user.avatarURL() })
    desc && embed.setDescription(desc);

    
    // TODO: Replace with actual logging system
    console.log(`LOG - [${user ? user.username : "Cookie"}] ${desc ?? ""}`);
    client.channels.fetch(Channels.Dev.LOGS)
        .then((channel: TextChannel) => channel.send({ embeds: [embed] }))
        .catch((err) => { throw new Error(err) });
}

export default log;