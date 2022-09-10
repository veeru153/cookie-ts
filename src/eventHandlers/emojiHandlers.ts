import { GuildEmoji } from "discord.js";
import { updateEmotes } from "../jobs/updateEmotes";
import logger from "../util/logger";

export enum Action {
    ADD = "added",
    REMOVE = "removed",
    UPDATE = "updated",
}

export const emojiHandler = async (emoji: GuildEmoji, action: Action) => {
    const { username, discriminator, id } = emoji.author;
    logger.info(`[Emoji] ${emoji.name} (${emoji.id}) ${action} by User: ${username}#${discriminator} (${id})`);
    try {
        updateEmotes.run(null, null);
    } catch (err) {
        logger.error(`[Emoji] ${emoji.id} : ${err}`);
    }
}