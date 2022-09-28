import { GuildEmoji } from "discord.js";
import { getUserLogString } from "../helpers";
import { updateEmotes } from "../jobs/updateEmotes";
import logger from "../util/logger";

export enum Action {
    ADD = "added",
    REMOVE = "removed",
    UPDATE = "updated",
}

export const emojiHandler = async (emoji: GuildEmoji, action: Action) => {
    logger.info(`[Emoji] ${emoji.name} (${emoji.id}) ${action} by User: ${getUserLogString(emoji.author)}`);
    try {
        updateEmotes.run(null, null);
    } catch (err) {
        logger.error(`[Emoji] ${emoji.id} : ${err}`);
    }
}